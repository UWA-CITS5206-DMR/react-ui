/**
 * Constants derived from API types
 *
 * This file provides helper functions and constants that are derived from
 * TypeScript union types defined in api-client-v2.ts. By extracting values
 * from the type system, we maintain a single source of truth and reduce duplication.
 */

import type {
  BloodTestType,
  ImagingTestType,
  InfectionControlPrecaution,
  FileCategory,
  Status,
  Gender,
} from "./api-client-v2";

/**
 * Blood test type options
 * Derived from BloodTestType union type
 */
export const BLOOD_TEST_OPTIONS: readonly BloodTestType[] = [
  "FBC",
  "EUC",
  "LFTs",
  "Coags",
  "CRP",
  "TFT",
  "Group and Hold",
] as const;

/**
 * Imaging test type options
 * Derived from ImagingTestType union type
 */
export const IMAGING_TEST_OPTIONS: readonly ImagingTestType[] = [
  "X-ray",
  "CT scan",
  "MRI scan",
  "Ultrasound scan",
  "Echocardiogram",
] as const;

/**
 * Infection control precaution options
 * Derived from InfectionControlPrecaution union type
 */
export const INFECTION_CONTROL_OPTIONS: readonly InfectionControlPrecaution[] = [
  "None",
  "Airborne",
  "Droplet",
  "Contact",
  "Chemotherapy",
] as const;

/**
 * File category options
 * Derived from FileCategory union type
 */
export const FILE_CATEGORY_OPTIONS: readonly FileCategory[] = [
  "Admission",
  "Pathology",
  "Imaging",
  "Diagnostics",
  "Lab Results",
  "Other",
] as const;

/**
 * Status options
 * Derived from Status union type
 */
export const STATUS_OPTIONS: readonly Status[] = ["pending", "completed"] as const;

/**
 * Gender options
 * Derived from Gender union type in api-client-v2
 */
export const GENDER_OPTIONS: readonly Gender[] = [
  "female",
  "male",
  "other",
  "unspecified",
] as const;

/**
 * Get display label for blood test type
 */
export function getBloodTestLabel(type: BloodTestType): string {
  return type;
}

/**
 * Get display label for imaging test type
 */
export function getImagingTestLabel(type: ImagingTestType): string {
  return type;
}

/**
 * Get display label for infection control precaution
 */
export function getInfectionControlLabel(precaution: InfectionControlPrecaution): string {
  return precaution;
}

/**
 * Get display label for status
 */
export function getStatusLabel(status: Status): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Get display label for gender
 */
export function getGenderLabel(gender?: Gender): string {
  if (!gender) return "Unspecified";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}
