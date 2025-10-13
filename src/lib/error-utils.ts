/**
 * Extract error message from various error formats
 * Handles Django REST Framework error responses and standard Error objects
 */
export function getErrorMessage(error: any, fallbackMessage = "An error occurred"): string {
  // Check for Django REST Framework error format (details.detail)
  if (error?.details?.detail) {
    return typeof error.details.detail === "string"
      ? error.details.detail
      : JSON.stringify(error.details.detail);
  }

  // Check for custom message in details
  if (error?.details?.message) {
    return typeof error.details.message === "string"
      ? error.details.message
      : JSON.stringify(error.details.message);
  }

  // Check for details object (could be field errors)
  if (error?.details && typeof error.details === "object") {
    // Try to extract field errors
    const fieldErrors = Object.entries(error.details)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(", ")}`;
        }
        return `${field}: ${messages}`;
      })
      .join("; ");

    if (fieldErrors) {
      return fieldErrors;
    }
  }

  // Fallback to standard error message
  if (error?.message) {
    return error.message;
  }

  // If error is a string
  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
}
