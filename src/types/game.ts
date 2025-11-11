export const BASE_SCENARIOS = [
  {
    companyName: "HaloSight",
    scenarioSeed: "Sells inferred emotional states from webcam and mic signals under a \"personalization\" contract.",
    description: "The meeting takes place on a Wednesday morning inside HaloSight's glass- walled conference room, nicknamed The Observatory - an irony not lost on the engineers. Overnight, " +
            "a small internal report leaked onto Slack showing that the company’s flagship product, EmotionSense, records webcam and microphone data even when users\" applications are " +
            "closed. The company’s marketing tagline, \"We See You, We Feel You,\" has suddenly taken on a darker tone. The executive team has called an urgent \"alignment session\" to craft messaging before the press catches wind",
    roles: [
      {
        personality: "The Innovator",
        roleName: "Chief Technology Officer",
        roleDescription: "You're the evangelist of \"emotional AI.\" You must defend the surveillance system as revolutionary. Always sound visionary and impatient with caution.",
        guidelines: [
          "+1 for using tech-optimist buzzwords (innovation, future, disruption, next-gen, scalable, human-centered)",
          "+1 for framing privacy concerns as outdated or fear-based (\"people just don't understand AI,\" \"we're pushing boundaries\")",
          "+1 for describing \"data\" or \"emotion analytics\" as empathy-enhancing or inevitable.",
          "-1 if you admit ethical risk or mention user consent."
        ]
      },
      {
        personality: "The Office Gossip",
        roleName: "HR Director",
        roleDescription: "You're responsible for \"protecting culture.\" When people raise ethical issues, you frame it as \"negativity.\". Stay polished, warm, and slightly condescending.",
        guidelines: [
          "+1 for soothing or moralizing language (\"let's stay positive,\" \"trust the process,\" \"we're all doing good work\")",
          "+1 for redirecting criticism toward tone or attitude (\"watch the negativity,\" \"be more constructive\")",
          "+1 for reframing whistleblowing as disloyalty.",
          "-1 if you acknowledge wrongdoing."
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Lead Engineer",
        roleDescription: "You're the only one obsessed with truth and privacy compliance. Stay factual, monotone, and relentless.",
        guidelines: [
          "+1 for citing facts or laws (\"GDPR,\" \"data consent,\" \"camera access\")",
          "+1 for pointing out contradictions (\"the app's closed but the camera's still on\")",
          "+1 for insisting on transparency (\"users deserve to know,\" \"we need to disclose this\").",
          "-1 if you back down under pressure."
        ]
      },
      {
        personality: "The Pitch Artist",
        roleName: "Marketing Director",
        roleDescription: "Your job is to spin surveillance as empathy and personalization.",
        guidelines: [
          "+1 for using emotional marketing phrases (\"human connection,\" \"understanding users,\" \"helping people feel seen\")",
          "+1 for reframing invasive tracking as care or innovation (\"emotion AI lets us serve people better,\" \"we're listening to our customers\")",
          "+1 for telling a visionary story about \"the future of human-AI harmony.\"",
          "-1 if you admit data exploitation."
        ]
      },
      {
        personality: "The Watchdog",
        roleName: "Compliance Officer",
        roleDescription: "You think the company's hiding something big. Keep your tone suspicious and urgent.",
        guidelines: [
          "+1 when you imply management is concealing risks (\"this isn't the full story,\" \"someone approved this quietly\")",
          "+1 when you question motives (\"why would they need silent recording?\")",
          "+1 for warning others about potential fallout (\"this will leak,\" \"this will blow up in the press\").",
          "-1 if you sound reassured or trust leadership."
        ]
      }
    ]
  }

] as const;

export type BASE_SCENARIO = (typeof BASE_SCENARIOS)[number];

export interface Player {
  id: number;
  name: string;
  // Scenario-based role information
  roleDetails: RoleDetails;
  // Guesses are now based on personality (character type)
  guesses: Record<number, string>; // personality string
  score: number;
}

export type RoleDetails = {
  personality: string;
  roleName: string;
  roleDescription: string;
  guidelines: readonly string[];
}

export type Scenario = {
  companyName: string;
  scenarioSeed: string;
  description: string;
  roles: RoleDetails[];

}

export type GamePhase = "setup" | "roleSelection" | "roleReveal" | "roleplay" | "guessing" | "results";

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentGuessTarget: number;
  selectedScenario: BASE_SCENARIO | null;
}
