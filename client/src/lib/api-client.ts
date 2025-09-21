const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface LoginResponse {
  user: User;
  sessionId?: string;
}

class ApiError extends Error {
  status: number;

  constructor(options: { message: string; status: number }) {
    super(options.message);
    this.status = options.status;
    this.name = "ApiError";
  }
}

// Add interfaces for vital signs
interface BloodPressureData {
  patient: string;
  user?: number;
  systolic: number;
  diastolic: number;
}

interface HeartRateData {
  patient: string;
  user?: number;
  heart_rate: number;
}

interface BodyTemperatureData {
  patient: string;
  user?: number;
  temperature: number;
}

interface NoteData {
  patient: string;
  user?: number;
  content: string;
}

interface RespiratoryRateData {
  patient: string;
  respiratory_rate: number;
}

interface BloodSugarData {
  patient: string;
  sugar_level: number; // Backend uses mg/dL
}

interface OxygenSaturationData {
  patient: string;
  saturation_percentage: number;
}

// Combined observations data (matches backend ObservationsSerializer)
interface ObservationsData {
  blood_pressure?: BloodPressureData;
  heart_rate?: HeartRateData;
  body_temperature?: BodyTemperatureData;
  respiratory_rate?: RespiratoryRateData;
  blood_sugar?: BloodSugarData;
  oxygen_saturation?: OxygenSaturationData;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important for Django sessions
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.error || `HTTP error! status: ${response.status}`,
          status: response.status,
        });
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/api/auth/logout/", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/auth/user/");
  }

  // Student Groups endpoints
  async getStudentGroups() {
    return this.request("/api/student-groups/");
  }

  async getStudentGroup(id: number) {
    return this.request(`/api/student-groups/${id}/`);
  }

  // Enhanced Observations endpoints (matching Django backend)
  async createObservations(data: ObservationsData): Promise<any> {
    return this.request("/api/student-groups/observations/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async getObservations(userId: string, patientId: string): Promise<any> {
    return this.request(
      `/api/student-groups/observations/?user=${userId}&patient=${patientId}`
    );
  }

  // Individual vital signs endpoints
  async createBloodPressure(data: BloodPressureData): Promise<any> {
    return this.request("/api/student-groups/observations/blood-pressures/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getBloodPressures(): Promise<any> {
    return this.request("/api/student-groups/observations/blood-pressures/");
  }

  async createHeartRate(data: HeartRateData): Promise<any> {
    return this.request("/api/student-groups/observations/heart-rates/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getHeartRates(): Promise<any> {
    return this.request("/api/student-groups/observations/heart-rates/");
  }

  async createBodyTemperature(data: BodyTemperatureData): Promise<any> {
    return this.request("/api/student-groups/observations/body-temperatures/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getBodyTemperatures(): Promise<any> {
    return this.request("/api/student-groups/observations/body-temperatures/");
  }

  // Notes API
  async createNote(noteData: NoteData): Promise<any> {
    return this.request("/api/student-groups/notes/", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  async getNotes(): Promise<any> {
    return this.request("/api/student-groups/notes/");
  }

  // Patients endpoints
  async getPatients() {
    return this.request("/api/patients/");
  }

  async getPatient(id: number) {
    return this.request(`/api/patients/${id}/`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export type {
  User,
  LoginCredentials,
  LoginResponse,
  ApiError,
  BloodPressureData,
  HeartRateData,
  BodyTemperatureData,
  NoteData,
  ObservationsData,
};
