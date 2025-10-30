export const BASE_ROLES = [
  "The Micromanager",
  "The Office Gossip",
  "The Charmer",
  "The Complainer",
  "The Buzzkill",
  "The Enforcer",
] as const;

export type Role = (typeof BASE_ROLES)[number];

export interface Player {
  id: number;
  name: string;
  role: Role;
  guesses: Record<number, Role>;
  score: number;
  roleGoals: Record<Role, string>;
}

export const roleDescription: Record<Role, string> = {
  "The Micromanager":
    "The Micromanager is characterized by a deep- seated need to control every aspect of work within their team. Often lacking trust in their" +
    "employees' abilities to perform tasks without oversight, they feel compelled to oversee all details, no matter how minor, believing that without" +
    "their involvement, nothing will be done correctly.",
  "The Office Gossip":
    "The Office Gossip is notorious for their knack for knowing everything about everyone in the office.From pending promotions to secret" +
    "relationships or personal struggles, no piece of information is too private or insignificant.While they can be engaging and sociable," +
    "their tendency to share confidential or speculative information complicates their relationships with colleagues.",
  "The Charmer":
    "The Charmer is a master of first impressions, exuding charisma and confidence that make them extremely likable and engaging at first" +
    "encounter.Beneath their polished exterior, however, lies a calculating individual with selfish motives and a lack of empathy for others." +
    "Their primary goal is to manipulate situations and people to their advantage, often at the expense of others' well-being.",
  "The Complainer":
    "The Complainer is the person everyone knows will have something negative to say about any situation. They frequently voice dissatisfaction" +
    "about various aspects of the workplace—from the mundane, like office supplies, to the more critical, such as management decisions.While they" +
    "are quick to highlight problems, they rarely offer solutions or take initiative to resolve the issues they complain about.This behavior can be" +
    "demoralizing for teams and disruptive to workplace harmony",
  "The Buzzkill":
    "The Buzzkill prides themselves on cutting through the noise. To them, clarity is kindness, and enthusiasm without rigor is dangerous. They don’t mean to deflate the" +
    "team — they’re just constitutionally allergic to hype.Their sharp intelligence and moral precision make them a truth- teller in theory and a nightmare in practice.Every" +
    "brainstorm feels like a debate, every pep talk becomes a logic exam.The intent is integrity; the effect is exhaustion.",
  "The Enforcer":
    "The Enforcer rules by tension. They maintain control through calculated volatility — everyone knows they could explode, even if they don’t today. Their presence changes" +
    "how people speak, breathe, and even think.Meetings become performance zones where everyone manages optics, not ideas. To leadership, they can look like “high performers”" +
    "who “get results.” Behind the scenes, morale collapses under the constant threat of humiliation or reprisal. Their power doesn’t come from competence — it comes from fear of the alternative.",
};

export const nicknames: Record<Role, string> = {
  "The Micromanager": "Domineering Devin",
  "The Office Gossip": "Dependent Drew",
  "The Charmer": "Charming Charlie",
  "The Complainer": "Pity-Party Parker",
  "The Buzzkill": "Blunt Bailey",
  "The Enforcer": "Menacing Marley",
};

export type GamePhase = "setup" | "roleReveal" | "guessing" | "results";

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentGuessTarget: number;
}
