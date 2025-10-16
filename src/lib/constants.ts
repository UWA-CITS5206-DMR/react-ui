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
  "Lipase",
  "Troponin",
  "Coag",
  "D-dimer",
  "CRP",
  "VBG",
  "Haptoglobin",
  "LDH",
  "Group & Hold",
  "Crossmatch",
  "Blood Culture",
  "TFT",
] as const;

const BLOOD_TEST_LABELS: Record<BloodTestType, string> = {
  FBC: "Full Blood Count (FBC)",
  EUC: "Electrolytes, Urea, Creatinine (EUC)",
  LFTs: "Liver Function Tests (LFTs)",
  Lipase: "Lipase",
  Troponin: "Troponin",
  Coag: "Coagulation Profile",
  "D-dimer": "D-dimer",
  CRP: "C-Reactive Protein (CRP)",
  VBG: "Venous Blood Gas (VBG)",
  Haptoglobin: "Haptoglobin",
  LDH: "Lactate Dehydrogenase (LDH)",
  "Group & Hold": "Group & Hold",
  Crossmatch: "Crossmatch",
  "Blood Culture": "Blood Culture",
  TFT: "Thyroid Function Tests (TFT)",
};

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
 * Default polling interval (milliseconds) used across the app for data refresh.
 * Pages and queries should import and use this constant (for example as
 * the `refetchInterval` value for React Query) so the interval is consistent.
 *
 * Chosen default: 3000 ms (3 seconds). Adjust as needed.
 */
export const POLLING_INTERVAL = 3000;

/**
 * Get display label for blood test type
 */
export function getBloodTestLabel(type: BloodTestType): string {
  return BLOOD_TEST_LABELS[type] ?? type;
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
