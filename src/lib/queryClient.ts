import { QueryClient } from "@tanstack/react-query";
import { ApiClientV2 } from "@/lib/api-client-v2";

// Function to get auth token from localStorage
function getAuthToken(): string | null {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
  } catch {
    console.warn("Failed to parse user data from localStorage");
  }
  return null;
}

// Custom fetcher that adds authentication token
async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  // Don't add token for login requests
  const url = typeof input === "string" ? input : input.toString();
  const isLoginRequest = url.includes("/auth/login");

  const headers = new Headers(init.headers);

  if (token && !isLoginRequest) {
    headers.set("Authorization", `Token ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

// Create API Client v2 instance with authenticated fetcher
// Note: Do not set Content-Type in defaultHeaders as it should be set dynamically
// based on the request body type (JSON, FormData, etc.)
export const apiClientV2 = new ApiClientV2({
  fetcher: authenticatedFetch,
});

// New QueryClient using API Client v2
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 1;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 1;
      },
      onError: (error: any) => {
        // Handle authentication errors globally
        if (error?.status === 401 || error?.status === 403) {
          // Clear stored user data
          localStorage.removeItem("user");
          // Redirect to login page
          window.location.href = "/";
        }
      },
    },
  },
});
