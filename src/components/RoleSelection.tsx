import React, { useEffect, useMemo, useState } from "react";
import { Lobby, LobbyPlayer } from "@/types/lobby";
import { BASE_ROLES, Role, nicknames } from "@/types/game";
import { Button } from "@/components/ui/button";

interface RoleSelectionProps {
  lobby: Lobby;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  // These are the hooks provided by useLobby — pass them in so this component can update DB rows
  updatePlayer: (
    playerId: string,
    updates: Partial<LobbyPlayer>,
  ) => Promise<void>;
  updateLobby: (updates: Partial<Lobby>) => Promise<void>;
}

/**
 * RoleSelection
 *
 * Displays an expanded role pool (length == number of players) as distinct instances and
 * allows each player to submit a full ranking of those instances (1..N).
 *
 * When every player has submitted a ranking, runs a simple STV-like greedy multi-winner
 * selection (repeatedly elect the instance with most first-choice votes, remove it, repeat)
 * then maps selected instances back to role names, randomly assigns the selected roles to
 * players, and advances the lobby to the `roleReveal` phase.
 *
 * The UI intentionally displays only the nickname labels for each role instance.
 */
export const RoleSelection: React.FC<RoleSelectionProps> = ({
  lobby,
  players,
  myPlayerId,
  updatePlayer,
  updateLobby,
}) => {
  const [localRanks, setLocalRanks] = useState<Record<string, number | null>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const numSlots = players.length;

  // Build expanded pool (may contain duplicates) so there are exactly `numSlots` entries
  const rolePool = useMemo(() => {
    const pool: Role[] = [];
    while (pool.length < numSlots) pool.push(...BASE_ROLES);
    return pool.slice(0, numSlots);
  }, [numSlots]);

  // Role instances: unique ids so duplicates are distinct ballot choices
  const roleInstances = useMemo(() => {
    return rolePool.map((role, index) => {
      const labelBase = nicknames[role] || role;
      // If duplicates exist for the same role, annotate them by instance index
      const duplicateCount = rolePool.filter((r) => r === role).length;
      let label = labelBase;
      if (duplicateCount > 1) {
        const instanceIndex = rolePool
          .slice(0, index + 1)
          .filter((r) => r === role).length;
        label = `${labelBase} (${instanceIndex})`;
      }
      return {
        id: `${role}#${index}`,
        role,
        label,
      };
    });
  }, [rolePool]);

  // Build ballot array ordered by ascending rank (1 is top)
  const buildBallotFromLocal = (): string[] => {
    const entries = Object.entries(localRanks).filter(
      ([, v]) => v !== null,
    ) as [string, number][];
    entries.sort((a, b) => a[1] - b[1]);
    return entries.map(([roleId]) => roleId);
  };

  const isLocalValid = (): boolean => {
    const assigned = Object.values(localRanks).filter(
      (v) => v !== null,
    ) as number[];
    if (assigned.length !== roleInstances.length) return false;
    const sorted = [...assigned].sort((a, b) => (a as number) - (b as number));
    for (let i = 0; i < numSlots; i++) {
      if (sorted[i] !== i + 1) return false;
    }
    return true;
  };

  const handleRankChange = (roleId: string, value: string) => {
    const rank = value === "" ? null : parseInt(value, 10);
    setLocalRanks((prev) => ({ ...prev, [roleId]: rank }));
  };

  const handleSubmit = async () => {
    if (!myPlayerId) return;
    if (!isLocalValid()) return;
    const ballot = buildBallotFromLocal();
    await updatePlayer(myPlayerId, { ranked_choices: ballot });
    setSubmitted(true);
  };

  // Check whether current player already submitted a ballot (persisted in DB)
  const myPlayer = players.find((p) => p.id === myPlayerId) as
    | LobbyPlayer
    | undefined;
  const alreadySubmitted = Boolean(
    myPlayer && Array.isArray((myPlayer as LobbyPlayer).ranked_choices),
  );

  // When all players have submitted ballots, run STV-like selection and finalize assignment
  useEffect(() => {
    const allSubmitted =
      players.length > 0 &&
      players.every(
        (p) =>
          Array.isArray((p as LobbyPlayer).ranked_choices) &&
          (p as LobbyPlayer).ranked_choices!.length === roleInstances.length,
      );

    if (allSubmitted) {
      // Run selection and assign roles
      (async () => {
        // Build ballots from DB (ordered lists of instance ids)
        const ballots: string[][] = players.map((p) => {
          const rc = (p as LobbyPlayer).ranked_choices;
          return Array.isArray(rc) ? rc.slice() : [];
        });

        // STV-like greedy multi-winner selection
        const seats = numSlots;
        const remaining = new Set(roleInstances.map((ri) => ri.id));
        const selected: string[] = [];

        while (selected.length < seats) {
          // Tally first-choice votes among remaining instances
          const tally: Record<string, number> = {};
          for (const b of ballots) {
            // find first available choice for this ballot
            const first = b.find((choice) => remaining.has(choice));
            if (first) tally[first] = (tally[first] || 0) + 1;
          }

          const entries = Object.entries(tally);
          if (entries.length === 0) break;

          // pick top vote getter; on ties pick randomly among top
          let max = -1;
          let top: string[] = [];
          for (const [id, cnt] of entries) {
            if (cnt > max) {
              max = cnt;
              top = [id];
            } else if (cnt === max) {
              top.push(id);
            }
          }

          const chosen =
            top.length === 1
              ? top[0]
              : top[Math.floor(Math.random() * top.length)];
          selected.push(chosen);
          remaining.delete(chosen);

          // remove chosen from ballots so next iteration uses next preferences
          for (const b of ballots) {
            let idx;
            while ((idx = b.indexOf(chosen)) !== -1) b.splice(idx, 1);
          }
        }

        // If not enough selected (edge cases), fill randomly from remaining instances
        const remainingArray = Array.from(remaining);
        const rnd = (arr: string[]) => {
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        };
        rnd(remainingArray);
        while (selected.length < seats && remainingArray.length)
          selected.push(remainingArray.shift() as string);

        // Map selected instance ids back to role names
        const selectedRoles = selected
          .map((sid) => roleInstances.find((ri) => ri.id === sid))
          .filter(Boolean)
          .map((ri) => (ri as { role: string }).role);

        // Shuffle selected roles then assign one per player
        const assigned = [...selectedRoles];
        rnd(assigned);

        for (let i = 0; i < players.length; i++) {
          const p = players[i];
          const role = assigned[i] ?? null;
          await updatePlayer(p.id, { role });
        }

        // Advance lobby to roleReveal
        await updateLobby({
          current_phase: "roleReveal",
          current_player_index: 0,
        });
      })().catch((e) => {
        console.error("Role selection finalize error:", e);
      });
    }
  }, [players, roleInstances, updatePlayer, updateLobby, numSlots]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Rank Roles</h2>
          <p className="text-muted-foreground">
            Assign ranks 1 (most desired) to {numSlots} (least desired). Only
            nicknames are shown.
          </p>
        </div>

        <div className="bg-card p-6 rounded-md">
          <div className="grid grid-cols-1 gap-4">
            {roleInstances.map((ri) => (
              <div
                key={ri.id}
                className="flex items-center justify-between p-3 bg-muted/10 rounded"
              >
                <div className="font-medium">{ri.label}</div>
                <div>
                  <select
                    value={localRanks[ri.id] ?? ""}
                    onChange={(e) => handleRankChange(ri.id, e.target.value)}
                    disabled={submitted || alreadySubmitted}
                    className="px-2 py-1 rounded bg-background"
                  >
                    <option value="">Rank</option>
                    {Array.from({ length: numSlots }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {!alreadySubmitted && (
            <Button
              onClick={handleSubmit}
              disabled={submitted || !isLocalValid()}
              className="flex-1"
            >
              Submit Rankings
            </Button>
          )}
          {alreadySubmitted && (
            <div className="flex-1 px-4 py-2 bg-secondary text-white rounded text-center">
              Rankings Submitted — waiting for others...
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Players submitted:{" "}
          {
            players.filter(
              (p) =>
                Array.isArray((p as LobbyPlayer).ranked_choices) &&
                (p as LobbyPlayer).ranked_choices!.length ===
                  roleInstances.length,
            ).length
          }
          /{players.length}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
