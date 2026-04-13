import type { Scenario } from "@/types/scenario";

/** Single-file format for bulk export/import of all scenarios. */
export const SCENARIO_BUNDLE_FORMAT = "fia-scenario-bundle" as const;
export const SCENARIO_BUNDLE_VERSION = 2;

export type ScenarioBundleRole = {
  personality: string;
  role_name: string;
  role_description: string;
  guidelines: string[];
  order_index: number;
};

/** One scenario in the bundle; `export_id` is the DB scenario id for stable round-trips (optional in old files). */
export type ScenarioBundleEntry = {
  export_id?: string;
  scenario_name: string;
  scenario_seed: string;
  description: string;
  roles: ScenarioBundleRole[];
};

export type ScenarioBundleFile = {
  format: typeof SCENARIO_BUNDLE_FORMAT;
  version: number;
  exportedAt: string;
  scenarios: ScenarioBundleEntry[];
};

/** Legacy exports (version 1) omitted `format` but used the same `scenarios` shape. */
type LegacyBundle = {
  version?: number;
  exportedAt?: string;
  scenarios: ScenarioBundleEntry[];
};

export function buildScenarioBundle(scenarios: Scenario[]): ScenarioBundleFile {
  return {
    format: SCENARIO_BUNDLE_FORMAT,
    version: SCENARIO_BUNDLE_VERSION,
    exportedAt: new Date().toISOString(),
    scenarios: scenarios.map((scenario) => ({
      export_id: scenario.id,
      scenario_name: scenario.scenario_name,
      scenario_seed: scenario.scenario_seed,
      description: scenario.description,
      roles: scenario.roles
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((role) => ({
          personality: role.personality,
          role_name: role.role_name,
          role_description: role.role_description,
          guidelines: role.guidelines,
          order_index: role.order_index,
        })),
    })),
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseScenarioBundleJson(raw: unknown):
  | { ok: true; scenarios: ScenarioBundleEntry[]; exportedAt?: string }
  | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return { ok: false, error: "File must be a JSON object." };
  }

  const legacy = raw as LegacyBundle;
  if (!Array.isArray(legacy.scenarios)) {
    return { ok: false, error: "Missing or invalid \"scenarios\" array." };
  }

  const format = raw.format;
  if (format !== undefined && format !== SCENARIO_BUNDLE_FORMAT) {
    return { ok: false, error: `Unknown bundle format: ${String(format)}` };
  }

  return {
    ok: true,
    scenarios: legacy.scenarios as ScenarioBundleEntry[],
    exportedAt: typeof legacy.exportedAt === "string" ? legacy.exportedAt : undefined,
  };
}
