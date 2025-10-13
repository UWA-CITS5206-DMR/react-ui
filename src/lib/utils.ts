import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Gender } from "./api-client-v2"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGender(gender?: Gender): string {
  switch (gender) {
    case "male":
      return "Male"
    case "female":
      return "Female"
    case "other":
      return "Other"
    default:
      return "Unspecified"
  }
}
