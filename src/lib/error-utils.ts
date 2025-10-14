/**
 * Extract error message from various error formats
 * Handles Django REST Framework error responses and standard Error objects
 */
export function getErrorMessage(error: any, fallbackMessage = "An error occurred"): string {
  // Helper: flatten DRF error detail values (string | string[] | object)
  const flattenDetailValue = (val: any): string[] => {
    if (val == null) return [];
    if (typeof val === "string") return [val];
    if (Array.isArray(val)) return val.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
    if (typeof val === "object") {
      // Could be nested dict like { non_field_errors: [..] } or field->errors
      return Object.values(val).flatMap((v) => flattenDetailValue(v));
    }
    return [String(val)];
  };

  // If DRF returned a 'detail' string or object
  if (error?.details?.detail) {
    const detail = error.details.detail;
    if (typeof detail === "string") return detail;
    // object => flatten
    const msgs = flattenDetailValue(detail);
    if (msgs.length) return msgs.join("; ");
  }

  // If there's a top-level message inside details
  if (error?.details?.message) {
    const msg = error.details.message;
    return typeof msg === "string" ? msg : JSON.stringify(msg);
  }

  // If details is an object (typical DRF field errors), iterate keys and flatten
  if (error?.details && typeof error.details === "object") {
    const parts: string[] = [];
    for (const [field, val] of Object.entries(error.details)) {
      const messages = flattenDetailValue(val);
      if (messages.length === 0) continue;
      // Treat non_field_errors specially: don't prefix with field
      if (field === "non_field_errors" || field === "__all__") {
        parts.push(...messages);
      } else {
        parts.push(`${field}: ${messages.join(", ")}`);
      }
    }
    if (parts.length) return parts.join("; ");
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
