import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Scenario, ScenarioRole, ScenarioUpdateInput } from "@/types/scenario";

const mapScenarioRows = (
  scenarios: Database["public"]["Tables"]["scenarios"]["Row"][],
  roles: Database["public"]["Tables"]["scenario_roles"]["Row"][],
): Scenario[] => {
  return scenarios.map((scenario) => {
    const scenarioRoles: ScenarioRole[] = roles
      .filter((role) => role.scenario_id === scenario.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((role) => ({
        id: role.id,
        scenario_id: role.scenario_id,
        personality: role.personality,
        role_name: role.role_name,
        role_description: role.role_description,
        guidelines: Array.isArray(role.guidelines)
          ? (role.guidelines as string[])
          : [],
        order_index: role.order_index ?? 0,
        created_at: role.created_at,
        updated_at: role.updated_at,
      }));

    return {
      id: scenario.id,
      scenario_name: scenario.scenario_name,
      scenario_seed: scenario.scenario_seed,
      description: scenario.description,
      is_active: scenario.is_active ?? true,
      created_at: scenario.created_at,
      updated_at: scenario.updated_at,
      roles: scenarioRoles,
    };
  });
};

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScenarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: scenarioRows, error: scenarioError },
        { data: roleRows, error: roleError },
      ] = await Promise.all([
        supabase
          .from("scenarios")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true }),
        supabase
          .from("scenario_roles")
          .select("*")
          .order("order_index", { ascending: true }),
      ]);

      if (scenarioError) throw scenarioError;
      if (roleError) throw roleError;

      setScenarios(mapScenarioRows(scenarioRows || [], roleRows || []));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch scenarios",
      );
      setScenarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const updateScenario = useCallback(
    async (scenarioId: string, payload: ScenarioUpdateInput) => {
      const { error: scenarioError } = await supabase
        .from("scenarios")
        .update({
          scenario_name: payload.scenario_name,
          scenario_seed: payload.scenario_seed,
          description: payload.description,
        })
        .eq("id", scenarioId);

      if (scenarioError) throw scenarioError;

      const existingRoleIds = payload.roles
        .map((role) => role.id)
        .filter((id): id is string => Boolean(id));

      if (existingRoleIds.length > 0) {
        // Build a safe list for the NOT IN clause
        const inList = existingRoleIds.map((id) => `"${id}"`).join(",");
        const { error: deleteRemovedError } = await supabase
          .from("scenario_roles")
          .delete()
          .eq("scenario_id", scenarioId)
          .not("id", "in", `(${inList})`);
        if (deleteRemovedError) throw deleteRemovedError;
      } else {
        const { error: clearRolesError } = await supabase
          .from("scenario_roles")
          .delete()
          .eq("scenario_id", scenarioId);
        if (clearRolesError) throw clearRolesError;
      }

      // Prepare role rows but do NOT send a null id for new roles.
      // Split into rows that should be inserted (no id) and rows that should be upserted (have an id).
      const roleRows = payload.roles.map((role, idx) => {
        // Base row without id
        const baseRow: {
          id?: string;
          scenario_id: string;
          personality: string;
          role_name: string;
          role_description: string;
          guidelines: string[] | unknown;
          order_index: number;
        } = {
          scenario_id: scenarioId,
          personality: role.personality,
          role_name: role.role_name,
          role_description: role.role_description,
          guidelines: role.guidelines,
          order_index: role.order_index ?? idx,
        };

        // Only include id when it's a non-empty string (existing role). This prevents sending `id: null`.
        if (role.id && typeof role.id === "string" && role.id.trim() !== "") {
          baseRow.id = role.id;
        }

        return baseRow;
      });

      const toInsert = roleRows.filter((r) => !("id" in r));
      const toUpsert = roleRows.filter((r) => "id" in r);

      // Insert new roles (no id) so Postgres will use the default gen_random_uuid()
      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("scenario_roles")
          .insert(toInsert as any);
        if (insertError) throw insertError;
      }

      // Upsert existing roles by id
      if (toUpsert.length > 0) {
        const { error: upsertError } = await supabase
          .from("scenario_roles")
          .upsert(toUpsert as any, { onConflict: "id" });
        if (upsertError) throw upsertError;
      }

      await fetchScenarios();
    },
    [fetchScenarios],
  );

  const createScenario = useCallback(async () => {
    const { data, error } = await supabase
      .from("scenarios")
      .insert({
        scenario_name: "New Scenario",
        scenario_seed: "Add a short scenario seed.",
        description: "Add a full scenario description.",
        is_active: true,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Insert the default role without specifying `id` so DB generates it.
    await supabase.from("scenario_roles").insert({
      scenario_id: data.id,
      personality: "New Personality",
      role_name: "New Role",
      role_description: "Add role description.",
      guidelines: ["+1 for staying in character"],
      order_index: 0,
    });

    await fetchScenarios();
    return data.id as string;
  }, [fetchScenarios]);

  const deleteScenario = useCallback(
    async (scenarioId: string) => {
      const { error } = await supabase
        .from("scenarios")
        .delete()
        .eq("id", scenarioId);
      if (error) throw error;
      await fetchScenarios();
    },
    [fetchScenarios],
  );

  return {
    scenarios,
    loading,
    error,
    refetch: fetchScenarios,
    updateScenario,
    createScenario,
    deleteScenario,
  };
};
