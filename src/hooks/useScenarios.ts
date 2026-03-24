import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Scenario, ScenarioRole, ScenarioUpdateInput } from "@/types/scenario";

const mapScenarioRows = (
  scenarios: Array<any>,
  roles: Array<any>,
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

      const [{ data: scenarioRows, error: scenarioError }, { data: roleRows, error: roleError }] =
        await Promise.all([
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
      setError(err instanceof Error ? err.message : "Failed to fetch scenarios");
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
        const { error: deleteRemovedError } = await supabase
          .from("scenario_roles")
          .delete()
          .eq("scenario_id", scenarioId)
          .not("id", "in", `(${existingRoleIds.map((id) => `"${id}"`).join(",")})`);
        if (deleteRemovedError) throw deleteRemovedError;
      } else {
        const { error: clearRolesError } = await supabase
          .from("scenario_roles")
          .delete()
          .eq("scenario_id", scenarioId);
        if (clearRolesError) throw clearRolesError;
      }

      const upsertPayload = payload.roles.map((role, idx) => ({
        id: role.id,
        scenario_id: scenarioId,
        personality: role.personality,
        role_name: role.role_name,
        role_description: role.role_description,
        guidelines: role.guidelines,
        order_index: role.order_index ?? idx,
      }));

      if (upsertPayload.length > 0) {
        const { error: upsertError } = await supabase
          .from("scenario_roles")
          .upsert(upsertPayload, { onConflict: "id" });
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
