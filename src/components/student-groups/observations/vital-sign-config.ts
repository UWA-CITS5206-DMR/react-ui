/**
 * @deprecated This file has been moved to @/lib/vital-signs.ts
 *
 * This file is kept for backward compatibility but will be removed in a future version.
 * Please update your imports to use:
 *
 * ```typescript
 * import { VITAL_SIGN_CONFIGS, BLOOD_PRESSURE_CONFIG } from "@/lib/vital-signs";
 * ```
 *
 * The new centralized configuration provides:
 * - All vital sign configurations
 * - Helper functions for formatting vital signs
 * - Chart configuration (colors, domains)
 * - Better type safety with VitalSignKey type
 */

// Re-export from the new location for backward compatibility
export type { VitalSignConfig, VitalSignKey, BloodPressureKey } from "@/lib/vital-signs";

export {
  VITAL_SIGN_CONFIGS,
  BLOOD_PRESSURE_CONFIG,
  BLOOD_PRESSURE,
  formatVitalSign,
  formatBloodPressure,
  formatBloodPressureShort,
  formatVitalSignForChart,
  getVitalSignAbbreviation,
  getBloodPressureAbbreviation,
  getVitalSignLabel,
  getVitalSignUnit,
  getVitalSignChartConfig,
} from "@/lib/vital-signs";
