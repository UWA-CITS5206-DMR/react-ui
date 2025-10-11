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
}

/**
 * Configuration for individual vital signs
 */
export const VITAL_SIGN_CONFIGS: Record<string, VitalSignConfig> = {
  heartRate: {
    key: "heartRate",
    label: "Heart Rate",
    unit: "bpm",
    placeholder: "72",
    type: "number",
  },
  temperature: {
    key: "temperature",
    label: "Body Temperature",
    unit: "°C",
    placeholder: "36.5",
    type: "number",
    step: "0.1",
  },
  respiratoryRate: {
    key: "respiratoryRate",
    label: "Respiratory Rate",
    unit: "/min",
    placeholder: "16",
    type: "number",
  },
  oxygenSaturation: {
    key: "oxygenSaturation",
    label: "Oxygen Saturation",
    unit: "%",
    placeholder: "98",
    type: "number",
  },
  bloodSugar: {
    key: "bloodSugar",
    label: "Blood Sugar",
    unit: "mmol/L",
    placeholder: "5.5",
    type: "number",
    step: "0.1",
  },
  painScore: {
    key: "painScore",
    label: "Pain Score",
    unit: "(0-10)",
    placeholder: "0",
    type: "number",
    min: "0",
    max: "10",
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
  },
  diastolic: {
    key: "diastolic",
    label: "Diastolic",
    unit: "mmHg",
    placeholder: "80",
    type: "number" as const,
  },
};
