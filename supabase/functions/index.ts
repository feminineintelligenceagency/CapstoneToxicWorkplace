/// <reference lib="dom" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SYSTEM_GRADING_PROMPT } from "./gradingPrompt.ts";

type GradingPayload = {
  scenario?: { scenarioName?: string; scenarioDescription?: string };
  players: Array<{
    playerId: string;
    rolePersonality: string | null;
    roleName: string | null;
    roleDescription: string;
    roleGuidelines: readonly string[];
    utterances: Array<{ timestamp: number; text: string }>;
  }>;
  conversation?: Array<{
    timestamp: number;
    playerId: string;
    playerName: string;
    text: string;
  }>;
  scoringConfig?: { roleScoreWeight?: number };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return jsonResponse(
        { error: "OPENAI_API_KEY is not set in the Edge Function environment" },
        { status: 500 },
      );
    }

    const model = Deno.env.get("LLM_GRADING_MODEL") ?? "gpt-4o-mini";
    const body = (await req.json()) as GradingPayload;

    console.log("grade-roleplay-transcripts request", {
      envHasOpenAIkey: Boolean(openaiKey),
      model,
      payloadSummary: {
        scenario: body.scenario?.scenarioName ?? null,
        playerCount: Array.isArray(body.players) ? body.players.length : 0,
      },
    });

    const scoringInput = body;

    const players = scoringInput.players ?? [];
    const roleScoreWeight = Number(scoringInput.scoringConfig?.roleScoreWeight ?? 1);

    const userPrompt = `
You will be given a JSON object with this structure:
{
  "scenario": { "scenarioName"?: string, "scenarioDescription"?: string },
  "players": [
     {
       "playerId": string,
       "rolePersonality": string | null,
       "roleName": string | null,
       "roleDescription": string,
       "roleGuidelines": string[],
       "utterances": [{ "timestamp": number, "text": string }]
     }
  ],
  "conversation": [{ "timestamp": number, "playerId": string, "playerName": string, "text": string }],
  "scoringConfig": { "roleScoreWeight": number }
}

Task
- Score each player (ONLY based on their utterances for role adherence; use conversation only to assess interaction quality).
- Apply roleGuidelines weights (+N / -N) using clear evidence.
- For each player include a concise 'playerSummary' (1-2 sentences) explaining why they received their roleplay score.
- Output JSON using the exact schema and JSON-only constraint described in the system prompt.

Data:
${JSON.stringify(scoringInput)}
`.trim();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_GRADING_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text().catch(() => "");
      console.error("OpenAI error", { status: openaiRes.status, text });
      return jsonResponse(
        { error: "LLM request failed", status: openaiRes.status, details: text },
        { status: 500 },
      );
    }

    const openaiJson = await openaiRes.json();
    console.log("OpenAI full response", JSON.stringify(openaiJson));
    const content = openaiJson?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      console.error("OpenAI returned empty content", { openaiJson });
      return jsonResponse(
        { error: "LLM returned empty content", details: openaiJson },
        { status: 500 },
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content) as {
        scoringVersion?: string;
        players: Array<{
          playerId: string;
          roleAdherenceScore: number;
          interactionScore: number;
          roleScore: number;
          topicScore?: number;
          playerSummary?: string;
          guidelineBreakdown?: Array<{
            rule: string;
            applied: boolean;
            points: number;
            evidence: string;
          }>;
          interactionEvidence?: string;
        }>;
        notes?: string;
      };
    } catch (err) {
      console.error("OpenAI JSON parse failed", { content, err });
      return jsonResponse(
        { error: "Invalid JSON from LLM", details: String(err), rawContent: content },
        { status: 500 },
      );
    }

    // Normalize output + apply roleScoreWeight.
    const outputPlayers = (parsed.players ?? []).map((p) => {
      const adherence = Number.isFinite(p.roleAdherenceScore) ? p.roleAdherenceScore : 0;
      const interaction = Number.isFinite(p.interactionScore) ? p.interactionScore : 0;
      // Prefer explicit roleScore from the LLM when provided, otherwise
      // fall back to adherence + interaction, then apply weight.
      const rawRoleScore = Number.isFinite(p.roleScore)
        ? (p.roleScore as number)
        : adherence + interaction;
      const baseRoleScore = Math.round(rawRoleScore * roleScoreWeight);
      const playerSummary = p.playerSummary?.trim() || (
        p.guidelineBreakdown && p.guidelineBreakdown.length > 0
          ? p.guidelineBreakdown
              .slice(0, 2)
              .map((g) => `${g.applied ? "+" : "-"}${g.points} for ${g.rule}`)
              .join("; ")
          : "No explicit summary provided by LLM."
      );

      return {
        playerId: p.playerId,
        roleAdherenceScore: adherence,
        interactionScore: interaction,
        roleScore: baseRoleScore,
        playerSummary,
        guidelineBreakdown: p.guidelineBreakdown ?? [],
        interactionEvidence: p.interactionEvidence ?? "",
      };
    });

    // Ensure we return a score for each input player (fallback to 0).
    const byId = new Map(outputPlayers.map((p) => [p.playerId, p]));
    const finalPlayers = players.map((p) => {
      const found = byId.get(p.playerId);
      return found ?? {
        playerId: p.playerId,
        roleAdherenceScore: 0,
        interactionScore: 0,
        roleScore: 0,
        playerSummary: "No roleplay summary available.",
        guidelineBreakdown: [],
        interactionEvidence: "",
      };
    });

    return jsonResponse({
      scoringVersion: parsed.scoringVersion ?? "v1",
      players: finalPlayers,
      notes: parsed.notes ?? "ok",
    });
  } catch (err) {
    return jsonResponse(
      { error: "Unexpected error", details: String(err) },
      { status: 500 },
    );
  }
});

