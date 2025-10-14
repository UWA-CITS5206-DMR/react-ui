/**
 * Vital Signs Configuration and Utilities
 *
 * This file provides centralized configuration for all vital signs used throughout
 * the application. It follows the same pattern as constants.ts for consistent
 * management of medical data types.
 */

/**
 * Vital Sign Type Definitions
 */
export interface VitalSignConfig {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  type: "number" | "text";
  step?: string;
  min?: string;
  max?: string;
  icon?: string;
  chartColor?: string;
  chartDomain?: [number, number];
  abbreviation?: string;
}

/**
 * Vital sign keys for type safety
 */
export type VitalSignKey =
  | "heartRate"
  | "temperature"
  | "respiratoryRate"
  | "oxygenSaturation"
  | "bloodSugar"
  | "painScore";

/**
 * Blood pressure component keys
 */
export type BloodPressureKey = "systolic" | "diastolic";

/**
 * Configuration for individual vital signs
 */
export const VITAL_SIGN_CONFIGS: Record<VitalSignKey, VitalSignConfig> = {
  heartRate: {
    key: "heartRate",
    label: "Heart Rate",
    unit: "bpm",
    placeholder: "72",
    type: "number",
    chartColor: "#10b981",
    chartDomain: [40, 140],
    abbreviation: "HR",
  },
  temperature: {
    key: "temperature",
    label: "Body Temperature",
    unit: "°C",
    placeholder: "36.5",
    type: "number",
    step: "0.1",
    chartColor: "#f59e0b",
    chartDomain: [35, 40],
    abbreviation: "Temp",
  },
  respiratoryRate: {
    key: "respiratoryRate",
    label: "Respiratory Rate",
    unit: "/min",
    placeholder: "16",
    type: "number",
    chartColor: "#8b5cf6",
    chartDomain: [10, 30],
    abbreviation: "RR",
  },
  oxygenSaturation: {
    key: "oxygenSaturation",
    label: "Oxygen Saturation",
    unit: "%",
    placeholder: "98",
    type: "number",
    chartColor: "#06b6d4",
    chartDomain: [90, 100],
    abbreviation: "O2",
  },
  bloodSugar: {
    key: "bloodSugar",
    label: "Blood Sugar",
    unit: "mg/dL",
    placeholder: "60",
    type: "number",
    step: "0.1",
    chartColor: "#ec4899",
    chartDomain: [60, 200],
    abbreviation: "BS",
  },
  painScore: {
    key: "painScore",
    label: "Pain Score",
    unit: "0-10",
    placeholder: "0",
    type: "number",
    min: "0",
    max: "10",
    chartColor: "#ef4444",
    chartDomain: [0, 10],
    abbreviation: "Pain",
  },
};

/**
 * Blood pressure special configuration (requires two fields)
 */
export const BLOOD_PRESSURE_CONFIG = {
  systolic: {
    key: "systolic",
    label: "Systolic",
    unit: "mmHg",
    placeholder: "120",
    type: "number" as const,
    chartColor: "#ef4444",
  },
  diastolic: {
    key: "diastolic",
    label: "Diastolic",
    unit: "mmHg",
    placeholder: "80",
    type: "number" as const,
    chartColor: "#3b82f6",
  },
} as const;

/**
 * Blood pressure combined configuration
 */
export const BLOOD_PRESSURE = {
  label: "Blood Pressure",
  unit: "mmHg",
  abbreviation: "BP",
  chartColor: "#ef4444",
  chartDomain: [60, 180] as [number, number],
} as const;

/**
 * Helper function to format a vital sign value with its unit
 */
export function formatVitalSign(key: VitalSignKey, value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }

  const config = VITAL_SIGN_CONFIGS[key];
  return `${value} ${config.unit}`;
}

/**
 * Helper function to format blood pressure
 */
export function formatBloodPressure(
  systolic: number | string | undefined,
  diastolic: number | string | undefined
): string {
  if (!systolic || !diastolic) {
    return "N/A";
  }
  return `${systolic}/${diastolic} ${BLOOD_PRESSURE.unit}`;
}

/**
 * Helper function to format blood pressure short form (for overview displays)
 */
export function formatBloodPressureShort(
  systolic: number | string | undefined,
  diastolic: number | string | undefined
): string {
  if (!systolic || !diastolic) {
    return "";
  }
  return `${systolic}/${diastolic}`;
}

/**
 * Helper function to format vital sign for chart tooltip
 */
export function formatVitalSignForChart(key: VitalSignKey, value: number): string {
  const config = VITAL_SIGN_CONFIGS[key];
  return `${value} ${config.unit}`;
}

/**
 * Helper function to get vital sign abbreviation with value
 */
export function getVitalSignAbbreviation(
  key: VitalSignKey,
  value: number | string | undefined
): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const config = VITAL_SIGN_CONFIGS[key];
  return `${config.abbreviation}: ${value} ${config.unit}`;
}

/**
 * Helper function to get blood pressure abbreviation with value
 */
export function getBloodPressureAbbreviation(
  systolic: number | string | undefined,
  diastolic: number | string | undefined
): string | null {
  if (!systolic || !diastolic) {
    return null;
  }
  return `${BLOOD_PRESSURE.abbreviation}: ${systolic}/${diastolic}`;
}

/**
 * Get display label for a vital sign
 */
export function getVitalSignLabel(key: VitalSignKey): string {
  return VITAL_SIGN_CONFIGS[key].label;
}

/**
 * Get unit for a vital sign
 */
export function getVitalSignUnit(key: VitalSignKey): string {
  return VITAL_SIGN_CONFIGS[key].unit;
}

/**
 * Get chart configuration for a vital sign
 */
export function getVitalSignChartConfig(key: VitalSignKey) {
  const config = VITAL_SIGN_CONFIGS[key];
  return {
    color: config.chartColor,
    domain: config.chartDomain,
    label: config.label,
    unit: config.unit,
  };
}
