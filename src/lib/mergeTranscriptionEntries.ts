import type { TranscriptionEntry } from "@/types/call";

/**
 * Merges transcript batches from the same player (e.g. server + local) and dedupes
 * so periodic sync + final upload cannot wipe earlier lines.
 */
export function mergeTranscriptionEntries(
  batches: TranscriptionEntry[][],
): TranscriptionEntry[] {
  const key = (e: TranscriptionEntry) =>
    `${e.playerId}|${e.timestamp}|${e.text.trim()}`;
  const seen = new Set<string>();
  const out: TranscriptionEntry[] = [];
  for (const batch of batches) {
    for (const e of batch) {
      if (!e?.text?.trim()) continue;
      const k = key(e);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({
        playerId: e.playerId,
        text: e.text.trim(),
        timestamp: e.timestamp,
      });
    }
  }
  out.sort((a, b) => a.timestamp - b.timestamp);
  return out;
}
