export interface ScenarioRole {
  id: string;
  scenario_id: string;
  personality: string;
  role_name: string;
  role_description: string;
  guidelines: string[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Scenario {
  id: string;
  scenario_name: string;
  scenario_seed: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  roles: ScenarioRole[];
}

export interface ScenarioUpdateInput {
  scenario_name: string;
  scenario_seed: string;
  description: string;
  roles: Array<{
    id?: string;
    personality: string;
    role_name: string;
    role_description: string;
    guidelines: string[];
    order_index: number;
  }>;
}
