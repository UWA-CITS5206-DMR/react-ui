import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date into a localized string using Intl.DateTimeFormat options.
 * - dateInput: string or Date
 * - locale: default 'en-AU'
 * - options: Intl.DateTimeFormatOptions (e.g. { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
 */
export function formatDate(
  dateInput?: string | Date | null,
  options?: Intl.DateTimeFormatOptions,
  locale = "en-AU"
): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) return String(dateInput);
  try {
    if (options) {
      return d.toLocaleString(locale, options);
    }
    // default to include date and time: e.g. 13 Oct 2025, 14:05
    return d.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toString();
  }
}
