import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientV2 } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ObservationCreateBundle, User } from "@/lib/api-client-v2";

interface UseVitalSignMutationOptions {
  patientId: number;
  user: User | null;
  onSuccess?: () => void;
}

/**
 * Generic hook for creating vital sign observation records
 */
export function useVitalSignMutation({ patientId, user, onSuccess }: UseVitalSignMutationOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: ObservationCreateBundle) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      return apiClientV2.studentGroups.observations.createBundle(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients", patientId, "vitals"] });
      
      const vitalSignType = Object.keys(variables)[0]
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      toast({
        title: "Success",
        description: `${vitalSignType} submitted successfully!`,
      });
      onSuccess?.();
    },
    onError: (error: Error, variables) => {
      const vitalSignType = Object.keys(variables)[0]
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
        
      toast({
        title: "Error",
        description: `Failed to submit ${vitalSignType}. ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

/**
 * Helper function: Create blood pressure observation payload
 */
export function createBloodPressurePayload(
  systolic: number,
  diastolic: number,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    blood_pressure: {
      systolic,
      diastolic,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create heart rate observation payload
 */
export function createHeartRatePayload(
  heartRate: number,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    heart_rate: {
      heart_rate: heartRate,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create body temperature observation payload
 */
export function createBodyTemperaturePayload(
  temperature: string,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    body_temperature: {
      temperature,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create respiratory rate observation payload
 */
export function createRespiratoryRatePayload(
  respiratoryRate: number,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    respiratory_rate: {
      respiratory_rate: respiratoryRate,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create oxygen saturation observation payload
 */
export function createOxygenSaturationPayload(
  saturation: number,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    oxygen_saturation: {
      saturation_percentage: saturation,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create blood sugar observation payload
 */
export function createBloodSugarPayload(
  sugarLevel: string,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    blood_sugar: {
      sugar_level: sugarLevel,
      patient: patientId,
      user: userId,
    },
  };
}

/**
 * Helper function: Create pain score observation payload
 */
export function createPainScorePayload(
  score: number,
  patientId: number,
  userId: number
): ObservationCreateBundle {
  return {
    pain_score: {
      score,
      patient: patientId,
      user: userId,
    },
  };
}
