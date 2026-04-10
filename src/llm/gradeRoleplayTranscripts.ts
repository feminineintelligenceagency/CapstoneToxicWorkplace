import { supabase } from "@/integrations/supabase/client";
import type { GradingPayload } from "@/llm/prepareTranscriptsForGrading";

export type RoleplayGradingResult = {
  scoringVersion: string;
  players: Array<{
    playerId: string;
    roleAdherenceScore: number;
    interactionScore: number;
    roleScore: number;
    playerSummary?: string;
    guidelineBreakdown: Array<{
      rule: string;
      applied: boolean;
      points: number;
      evidence: string;
    }>;
    interactionEvidence: string;
  }>;
  notes: string;
};

export async function gradeRoleplayTranscripts(
  payload: GradingPayload,
): Promise<RoleplayGradingResult> {
  console.log(
    "[grade-roleplay-transcripts] Request body sent to edge function (compare with OpenAI / function logs):",
    payload,
  );

  const { data, error } = await supabase.functions.invoke("grade-roleplay-transcripts", {
    body: payload,
  });

  if (error) throw error;

  return data as RoleplayGradingResult;
}

