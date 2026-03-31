-- Run this in Supabase SQL Editor.
-- It creates normalized scenario tables and migrates lobbies to scenario_id.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  legacy_index integer unique,
  scenario_name text not null,
  scenario_seed text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.scenario_roles (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  personality text not null,
  role_name text not null,
  role_description text not null,
  guidelines jsonb not null default '[]'::jsonb,
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_scenario_roles_scenario_id on public.scenario_roles(scenario_id);
create index if not exists idx_scenario_roles_order on public.scenario_roles(scenario_id, order_index);

drop trigger if exists trg_scenarios_updated_at on public.scenarios;
create trigger trg_scenarios_updated_at
before update on public.scenarios
for each row execute function public.set_updated_at();

drop trigger if exists trg_scenario_roles_updated_at on public.scenario_roles;
create trigger trg_scenario_roles_updated_at
before update on public.scenario_roles
for each row execute function public.set_updated_at();

alter table public.lobbies add column if not exists scenario_id uuid null references public.scenarios(id);

-- Keep legacy scenario_index during rollout.
-- The app now prefers scenario_id.

-- RLS
alter table public.scenarios enable row level security;
alter table public.scenario_roles enable row level security;

drop policy if exists "scenarios_select_all" on public.scenarios;
create policy "scenarios_select_all"
on public.scenarios
for select
using (true);

drop policy if exists "scenarios_write_all" on public.scenarios;
create policy "scenarios_write_all"
on public.scenarios
for all
using (true)
with check (true);

drop policy if exists "scenario_roles_select_all" on public.scenario_roles;
create policy "scenario_roles_select_all"
on public.scenario_roles
for select
using (true);

drop policy if exists "scenario_roles_write_all" on public.scenario_roles;
create policy "scenario_roles_write_all"
on public.scenario_roles
for all
using (true)
with check (true);

commit;

-- ------------------------------------------------------------
-- DATA MIGRATION (run after schema migration)
-- ------------------------------------------------------------
-- 1) Insert scenarios + roles from your existing constants.
--    Recommended approach:
--    - Use the Scenario Manager UI after this migration, or
--    - insert with SQL below.
--
-- 2) If you seed with legacy_index values that match old scenario_index,
--    map old lobbies automatically:
--
-- update public.lobbies l
-- set scenario_id = s.id
-- from public.scenarios s
-- where l.scenario_index is not null
--   and s.legacy_index = l.scenario_index;
--
-- 3) Move asset folders from old format to new format in Storage:
--    old: scenario-<index>/
--    new: scenario-<scenario_id>/
--    (or keep old assets and re-upload in Scenario Manager)
