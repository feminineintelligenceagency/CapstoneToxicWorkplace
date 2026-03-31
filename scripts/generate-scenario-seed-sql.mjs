import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const repoRoot = path.resolve(process.cwd());
const sourcePath = path.join(repoRoot, "src", "types", "game.ts");
const source = fs.readFileSync(sourcePath, "utf8");

const match = source.match(/export const BASE_SCENARIOS = (\[[\s\S]*?\]) as const;/);
if (!match) {
  throw new Error("Could not locate BASE_SCENARIOS in src/types/game.ts");
}

const scenarios = vm.runInNewContext(`(${match[1]})`);
if (!Array.isArray(scenarios) || scenarios.length === 0) {
  throw new Error("BASE_SCENARIOS parsed, but no scenarios found.");
}

const sqlString = (value) => `'${String(value ?? "").replace(/'/g, "''")}'`;
const sqlJson = (value) => `'${JSON.stringify(value ?? []).replace(/'/g, "''")}'::jsonb`;

let out = "";
out += "-- Generated from src/types/game.ts BASE_SCENARIOS\n";
out += "-- Run AFTER SUPABASE_SCENARIO_MIGRATION.sql\n\n";
out += "begin;\n\n";

for (let i = 0; i < scenarios.length; i += 1) {
  const scenario = scenarios[i];
  const scenarioName = scenario.scenarioName ?? `Scenario ${i + 1}`;
  const scenarioSeed = scenario.scenarioSeed ?? "";
  const description = scenario.description ?? "";
  const roles = Array.isArray(scenario.roles) ? scenario.roles : [];

  out += `-- Scenario ${i}: ${scenarioName}\n`;
  out += "with upsert_scenario as (\n";
  out += "  insert into public.scenarios (\n";
  out += "    legacy_index,\n";
  out += "    scenario_name,\n";
  out += "    scenario_seed,\n";
  out += "    description,\n";
  out += "    is_active\n";
  out += "  ) values (\n";
  out += `    ${i},\n`;
  out += `    ${sqlString(scenarioName)},\n`;
  out += `    ${sqlString(scenarioSeed)},\n`;
  out += `    ${sqlString(description)},\n`;
  out += "    true\n";
  out += "  )\n";
  out += "  on conflict (legacy_index)\n";
  out += "  do update set\n";
  out += "    scenario_name = excluded.scenario_name,\n";
  out += "    scenario_seed = excluded.scenario_seed,\n";
  out += "    description = excluded.description,\n";
  out += "    is_active = excluded.is_active,\n";
  out += "    updated_at = timezone('utc', now())\n";
  out += "  returning id\n";
  out += ")\n";
  out += "delete from public.scenario_roles\n";
  out += "where scenario_id in (select id from upsert_scenario);\n";

  if (roles.length > 0) {
    out += "insert into public.scenario_roles (\n";
    out += "  scenario_id,\n";
    out += "  personality,\n";
    out += "  role_name,\n";
    out += "  role_description,\n";
    out += "  guidelines,\n";
    out += "  order_index\n";
    out += ")\n";
    out += "values\n";

    roles.forEach((role, roleIndex) => {
      const personality = role.personality ?? "";
      const roleName = role.roleName ?? "";
      const roleDescription = role.roleDescription ?? "";
      const guidelines = Array.isArray(role.guidelines) ? role.guidelines : [];

      out += `  ((select id from public.scenarios where legacy_index = ${i}), `;
      out += `${sqlString(personality)}, `;
      out += `${sqlString(roleName)}, `;
      out += `${sqlString(roleDescription)}, `;
      out += `${sqlJson(guidelines)}, `;
      out += `${roleIndex})`;
      out += roleIndex === roles.length - 1 ? ";\n\n" : ",\n";
    });
  } else {
    out += "\n";
  }
}

out += "-- Map existing lobbies using legacy scenario_index\n";
out += "update public.lobbies l\n";
out += "set scenario_id = s.id\n";
out += "from public.scenarios s\n";
out += "where l.scenario_index is not null\n";
out += "  and s.legacy_index = l.scenario_index;\n\n";
out += "commit;\n";

process.stdout.write(out);
