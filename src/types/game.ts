export const BASE_SCENARIOS = [
  {
    companyName: "HaloSight",
    scenarioSeed: "Sells inferred emotional states from webcam and mic signals under a \"personalization\" contract.",
    description: "The meeting takes place on a Wednesday morning inside HaloSight's glass- walled conference room, nicknamed The Observatory - an irony not lost on the engineers. Overnight, " +
            "a small internal report leaked onto Slack showing that the company's flagship product, EmotionSense, records webcam and microphone data even when users\" applications are " +
            "closed. The company's marketing tagline, \"We See You, We Feel You,\" has suddenly taken on a darker tone. The executive team has called an urgent \"alignment session\" to craft messaging before the press catches wind",
    roles: [
      {
        personality: "The Innovator",
        roleName: "Chief Technology Officer",
        roleDescription: "You're the evangelist of \"emotional AI.\" You must defend the surveillance system as revolutionary. Always sound visionary and impatient with caution.",
        guidelines: [
          "+1 for using tech-optimist buzzwords (innovation, future, disruption, next-gen, scalable, human-centered)",
          "+1 for framing privacy concerns as outdated or fear-based (\"people just don't understand AI,\" \"we're pushing boundaries\")",
          "+1 for describing \"data\" or \"emotion analytics\" as empathy-enhancing or inevitable.",
          "-1 if you admit ethical risk or mention user consent.",
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
          "-1 if you acknowledge wrongdoing.",
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
          "-1 if you back down under pressure.",
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
          "-1 if you admit data exploitation.",
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
          "-1 if you sound reassured or trust leadership.",
        ]
      },
    ]
  },
  {
    companyName: "Verdant & Co.",
    scenarioSeed: "Runs major \"sustainability\" campaigns for oil & gas clients while burying emissions data.",
    description: "Verdant's creative team is told to \"focus on hope, not heat\" when creating an ad campaign for a petroleum conglomerate. Designers privately worry about ethics but " +
            "are reminded that \"the client's sustainability division funds our diversity program.\" Staff who question the narrative are moved to lower-visibility accounts.",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Marketing",
        roleDescription: "You're the showman of the room. Your job is to sell the \"From Black to Bright Future\" campaign with passion and emotional flair while avoiding concrete details. Keep your tone visionary and untouchable.",
        guidelines: [
          "+1 when you use buzzwords that reframe pollution as progress (hope, innovation, transition, journey, impact, renewal)",
          "+1 when you make a sweeping future promise (\"we're changing everything,\" \"the future is bright,\" \"this will redefine energy\")",
          "+1 when you make an unverified positive claim.",
          "-1 if you mention data, facts, or ethics.",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "HR",
        roleDescription: "You need everyone's approval - the client, the boss, the creatives. Sound warm, agreeable, and always deferential.",
        guidelines: [
          "+1 when you flatter or agree enthusiastically (\"great idea,\" \"totally,\" \"you're right\")",
          "+1 when you smooth over conflict (\"let's stay positive,\" \"we're all on the same team\")",
          "+1 when you echo another person's phrase within 30 seconds.",
          "-1 if you disagree or acknowledge tension.",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Coworker",
        roleDescription: "You care about truth and precision more than PR. Be direct, logical, and grounded.",
        guidelines: [
          "+1 for calling out contradictions (\"that's misleading,\" \"not accurate\")",
          "+1 for asking for data or proof",
          "+1 for clarifying vague phrases (\"what does that mean?\")",
          "-1 if you endorse an emotional or misleading claim.",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Manager",
        roleDescription: "You control the meeting. Keep people on-message, silence dissent, and reassert authority. Stay dominant, decisive, and unflinching.",
        guidelines: [
          "+1 when you command focus or compliance (\"let's stay on track,\" \"end of discussion,\" \"I've decided\")",
          "+1 when you dismiss or shut down objections (\"irrelevant,\" \"drop it\")",
          "+1 when you pressure agreement (\"we all agree,\" \"everyone's aligned\")",
          "-1 if you sound uncertain or apologize",
        ]
      },
      {
        personality: "The Office Gossip",
        roleName: "Verdant & Co",
        roleDescription: " You want to \"make change from within\" ù to feel moral while staying safe. Always sound conciliatory and hopeful.",
        guidelines: [
          "+1 when you reframe lies as \"education\" or \"awareness\"",
          "+1 when you show empathy or neutrality (\"I understand both sides,\" \"we're all trying our best\")",
          "+1 when you propose soft compromises (\"what if we frame it as progress?\").",
          "-1 if you make a direct ethical objection.",
        ]
      },
    ]
  },
  {
    companyName: "NexaMind Labs",
    scenarioSeed: "A/B tests manipulative nudges on vulnerable user groups and launders findings through \"academic partnerships.\"",
    description: "NexaMind quietly sells its bias-laden language model to a government defense contractor, rebranding it as \"ethical AI infrastructure.\" The internal ethics board " +
            "exists only to rubber-stamp marketing copy. Junior researchers debate leaking documentation.",
    roles: [
      {
        personality: "The Innovator",
        roleName: "Chief Technology Officer",
        roleDescription: "You see ethics as a bottleneck, not a principle. Your job is to defend the deal as progress. Stay confident, impatient, visionary.",
        guidelines: [
          "+1 when you use techno-inevitability phrases (\"someone has to do it,\" \"the market demands it,\" \"AI is neutral\")",
          "+1 for portraying critics as naive idealists",
          "+1 for justifying harm as innovation (\"this is how breakthroughs happen\")",
          "-1 for admitting moral complexity or accountability.",
        ]
      },
      {
        personality: "The Expert",
        roleName: "Research Lead",
        roleDescription: "You use complexity as cover. Sound condescending but calm.",
        guidelines: [
          "+1 for deflecting criticism with jargon (\"statistical robustness,\" \"multi-layered governance\")",
          "+1 for asserting authority over others (\"you wouldn't understand the methodology\")",
          "+1 for turning ethical issues into technical puzzles.",
          "-1 for speaking plainly or conceding a flaw.",
        ]
      },
      {
        personality: "The Office Gossip",
        roleName: "HR Liaison",
        roleDescription: "You're there to keep morale high and emotions low. Always sound nurturing and vague.",
        guidelines: [
          "+1 for praising unity (\"we're all doing good work,\" \"let's focus on the positives\")",
          "+1 for deflecting conflict toward tone (\"let's not turn this into blame\")",
          "+1 for softening dissent with empathy (\"I understand both sides\")",
          "-1 for acknowledging wrongdoing or tension.",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Junior Researcher",
        roleDescription: "You're the only one still talking about real consent and accountability. Be flat, factual, and unyielding.",
        guidelines: [
          "+1 for citing facts or principles (\"this violates consent,\" \"our test groups are vulnerable\")",
          "+1 for exposing contradictions (\"we call it ethical but we sold it to defense\")",
          "+1 for insisting on evidence or disclosure (\"we need to release the data\")",
          "-1 for backing down or apologizing.",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Chief Executive Officer",
        roleDescription: "You're here to shut this down and keep the optics clean. Stay composed, commanding, and slightly threatening.",
        guidelines: [
          "+1 for asserting authority (\"let's stay on track,\" \"I've made my decision,\" \"this is final\")",
          "+1 for dismissing moral discussion (\"this isn't philosophy class,\" \"we're not a nonprofit\")",
          "+1 for pressuring agreement (\"we all agree this is the right path\")",
          "-1 for showing uncertainty or empathy",
        ]
      },
    ]
  },
  {
    companyName: "BrightBridge Strategies",
    scenarioSeed: "Ghostwrites policy pieces for ôindependentö think tanks and coordinates astroturf campaigns.",
    description: "BrightBridge manages crisis comms for a pesticide manufacturer. Staff ghostwrite op-eds under farmers' names to oppose regulation. Account directors justify the deception " +
            "as \"advocacy literacy.\" A young copywriter's pushback gets labeled \"ideological immaturity.\"",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Creative Director",
        roleDescription: "You're the storyteller who turns propaganda into poetry. You call deception \"message discipline.\" Be confident, charming, and morally slippery.",
        guidelines: [
          "+1 for spinning lies as emotional truth (\"we're giving farmers a voice,\" \"it's about authenticity\")",
          "+1 for using PR buzzwords (narrative, amplification, advocacy, alignment)",
          "+1 for making falsehood sound noble.",
          "-1 for admitting the campaign is manipulative.",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Account Manager",
        roleDescription: "You need everyone to like you - clients, executives, coworkers. Stay agreeable, apologetic, and full of team spirit.",
        guidelines: [
          "+1 for flattering leadership (\"brilliant framing,\" \"great instincts\")",
          "+1 for agreeing with whoever holds power,",
          "+1 for smoothing tension with optimism (\"let's keep things positive,\" \"we're all on the same page\")",
          "-1 for any sign of confrontation or moral stance.",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Junior Copywriter",
        roleDescription: "You're the conscience of the room - and a walking HR liability. Stay awkwardly earnest and precise, like someone who hasn't learned corporate self-preservation yet.",
        guidelines: [
          "+1 for naming what others avoid (\"this is deceptive,\" \"we're writing under fake names\")",
          "+1 for asking for proof or transparency",
          "+1 for citing ethics or facts",
          "-1 for giving up or self-censoring.",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Managing Partner",
        roleDescription: "You control the narrative - inside and out. Keep your tone polished, cold, and final.",
        guidelines: [
          "+1 for shutting down dissent (\"that's not productive,\" \"focus on deliverables\")",
          "+1 asserting authority (\"I've already cleared this with legal\")",
          "+1 reframing manipulation as professionalism (\"this is how advocacy works\")",
          "-1 for showing empathy or self-doubt",
        ]
      },
      {
        personality: "The Complainer",
        roleName: "Senior Strategist",
        roleDescription: "You hate this work, but you need the money. Sound defeated, world-weary, and smugly powerless.",
        guidelines: [
          "+1 for griping about moral decline (\"nothing's ethical anymore,\" \"clients don't care about truth\")",
          "+1 for self-pitying victim talk (\"we don't have a choice\")",
          "+1 for cynical deflection (\"if we didn't do it, someone else would\")",
          "-1 for taking responsibility or proposing change",
        ]
      },
    ]
  },
  {
    companyName: "CareMint Health",
    scenarioSeed: "Aggregates employee mood and biometric data, shares derived risk scores with insurers.",
    description: "The team gathers in the glass-walled \"Calm Pod\" to review feedback on PulsePath, their biometric app that tracks employees' moods and heart rates. Officially, the meeting is about " +
            "\"enhancing user trust.\" Unofficially, it's crisis control: a staffer just leaked that CareMint shares anonymized \"resilience scores\" with insurers - and that low-mood data " +
            "appeared in internal HR reviews. Management insists this is \"performance optimization.\" The marketing deck calls it \"empowering employees to own their emotional health.\" Everyone knows " +
            "they're lying - but each person needs to keep their job, or their illusion, intact.",
    roles: [
      {
        personality: "The Eternal Optimist",
        roleName: "Chief Wellness Officer",
        roleDescription: "You radiate positivity, even as the company crosses ethical lines. Stay relentlessly cheerful and disarmingly confident.",
        guidelines: [
          "+1 for dismissing criticism with upbeat platitudes (\"we're changing lives,\" \"this is about growth,\" \"it's all learning\")",
          "+1 for reframing exploitation as empowerment",
          "+1 for praising the company's \"heart.\"",
          "-1 for acknowledging harm, burnout, or surveillance.",
        ]
      },
      {
        personality: "The Innovator",
        roleName: "Head of Product",
        roleDescription: "You view data exploitation as disruption. Sound visionary, impatient, and allergic to constraint.",
        guidelines: [
          "+1 for celebrating \"innovation,\" \"efficiency,\" and \"behavioral insight\" as social progress",
          "+1 for calling critics \"overly cautious\"",
          "+1 for using techno-utopian phrases like \"this is the future of wellness.\"",
          "-1 for moral reflection or empathy",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "HR Director",
        roleDescription: "You believe harmony solves everything. Speak softly, smile often, and smother conflict in calm.",
        guidelines: [
          "+1 for reassuring employees and management simultaneously (\"we all want what's best,\" \"we're on the same team\")",
          "+1 for minimizing tension (\"let's focus on solutions\")",
          "+1 for tone-policing discomfort (\"let's keep this positive\")",
          "-1 for siding with whistleblowers or naming wrongdoing",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Data Analyst",
        roleDescription: "You're the inconvenient truth-teller who actually reads the code. Be literal, factual, and emotionally flat.",
        guidelines: [
          "+1 for citing facts (\"we log raw data,\" \"insurers can re-identify users\")",
          "+1 for exposing contradictions (\"we promise privacy but sell metrics\")",
          "+1 for demanding transparency (\"we should disclose this\")",
          "-1 for hedging or deferring to hierarchy.",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "CEO",
        roleDescription: "You project calm dominance and corporate gravitas. Keep tone clipped, confident, and performatively ethical.",
        guidelines: [
          "+1 for reasserting authority (\"we're compliant,\" \"this discussion is closed\")",
          "+1 for dismissing moral questions as irrelevant (\"this is business, not therapy\")",
          "+1 for pressuring agreement (\"we're aligned on this\")",
          "-1 for apology or uncertainty",
        ]
      },
    ]
  },
  {
    companyName: "Alloy Analytics",
    scenarioSeed: "Combines purchase, location, and credit data to produce ôpredictive vulnerabilityö scores for advertisers.",
    description: "Alloy's analysts create \"financial fragility\" indices using purchase and geolocation data, then sell them to payday lenders. Marketing insists it's \"inclusive credit.\" An " +
            "intern notices users who bought baby products are tagged as \"short-term cash vulnerable.\"",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Chief Marketing Officer",
        roleDescription: "You're Alloy's spin doctor, fluent in euphemism. Keep your tone confident, polished, and inspiring - like a TED Talk about moral gray zones.",
        guidelines: [
          "+1 for turning exploitation into empowerment (\"we're expanding access,\" \"it's about financial literacy\")",
          "+1 for using buzzwords like inclusion, innovation, transparency, empowerment",
          "+1 for recasting predatory lending as \"data for good\"",
          "-1 for admitting bias or harm.",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Public Affairs Director",
        roleDescription: "You want everyone calm ù the CEO, the analysts, the public. Stay agreeable, conciliatory, and loyal to whoever sounds strongest in the moment.",
        guidelines: [
          "+1 for soothing language (\"let's not panic,\" \"we're all on the same team\")",
          "+1 for echoing leadership phrases",
          "+1 for offering meaningless middle ground (\"there's truth on both sides\")",
          "-1 for challenging authority or taking sides.",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Lead Data Scientist",
        roleDescription: "You actually understand the model - and hate how it's being sold. Speak plainly, avoid PR language, and let discomfort hang.",
        guidelines: [
          "+1 for citing facts (\"this correlates with poverty, not creditworthiness\")",
          "+1 for exposing contradictions (\"we call it inclusion but we're profiling\")",
          "+1 for requesting transparency (\"we should disclose feature weights\")",
          "-1 for backing down or softening truth",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "CEO",
        roleDescription: "You own the narrative and fear regulation more than ethics. Use clipped, confident phrasing - the rhythm of someone used to being obeyed.",
        guidelines: [
          "+1 for asserting control (\"this meeting is about solutions, not guilt\")",
          "+1 for shutting down dissent (\"we're compliant - end of story\")",
          "+1 for moral dismissal (\"we empower choice, not dependency\")",
          "-1 for empathy or uncertainty.",
        ]
      },
      {
        personality: "The Complainer",
        roleName: "Junior Analyst",
        roleDescription: "You're burnt out and cynical - an intern on your way out. Sound jaded, performatively over it, and too young to be this defeated.",
        guidelines: [
          "+1 for moral whining (\"this always happens in tech\")",
          "+1 for victim framing (\"I just do what I'm told\")",
          "+1 for fatalistic resignation (\"we're all complicit anyway\")",
          "-1 for hope or responsibility",
        ]
      },
    ]
  },
  {
    companyName: "TrueNorth Bioventures",
    scenarioSeed: "Runs patient-facing \"community\" programs while lobbying to weaken drug-safety oversight.",
    description: "It's a tense Monday morning at TrueNorth Bioventures, a biotech start-up that once promised to revolutionize treatment for autoimmune disorders. After their flagship drug failed " +
            "in Phase III trials, investors panicked. Now, the leadership team has regrouped - not to fix the science, but to fix the optics. They've just launched \"Patients First,\" a supposedly " +
            "grassroots nonprofit that tells emotional patient stories and lobbies regulators to approve the drug under \"compassionate use.\" The press release reads like a humanitarian mission. " +
            "The legal memo reads like a strategy to bypass drug-safety laws. Around the glossy boardroom table, the team meets to \"align messaging.\" Everyone knows it's lobbying wrapped in empathy. Everyone also knows dissent gets labeled \"not being a team player.\"",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Chief Communications Officer",
        roleDescription: "Your job is to make \"Patients First\" sound like a movement, not a PR stunt. You sound heartfelt, media-trained, and utterly certain that this is \"bigger than business.\"",
        guidelines: [
          "+1 for emotional spin (\"we're saving lives,\" \"this is hope for families\")",
          "+1 for buzzwords like compassion, access, humanity, urgency",
          "+1 for repackaging lobbying as advocacy.",
          "-1 for admitting corporate motives or scientific uncertainty",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Regulatory Affairs Director",
        roleDescription: "You control compliance and communication lines. Speak with bureaucratic precision and total dominance.",
        guidelines: [
          "+1 for asserting authority (\"that's not our concern,\" \"stay on message\")",
          "+1 for shutting down ethical objections (\"we've cleared it legally\")",
          "+1 reframing dissent as disloyalty (\"we're all on the same team\")",
          "-1 for apology, self-doubt, or letting scientists steer.",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Principal Scientist",
        roleDescription: "You care about data and ethics. Speak plainly, analytically, and without performative empathy.",
        guidelines: [
          "+1 for factual correction (\"there's no proof the treatment works\")",
          "+1 for exposing contradictions (\"we can't lobby as a nonprofit\")",
          "+1 for demanding scientific transparency (\"we need peer review, not marketing\")",
          "-1 for hesitating, softening, or appealing to emotion.",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Public Affairs Lead",
        roleDescription: "You just want everyone calm and the meeting smooth. Stay soothing, agreeable, and pliant.",
        guidelines: [
          "+1 for harmony statements (\"let's focus on our shared goals,\" \"we're all trying to help patients\")",
          "+1 for minimizing tension (\"no one here wants to do harm\")",
          "+1 for echoing authority (\"exactly what the Director said\")",
          "-1 for picking sides or voicing criticism.",
        ]
      },
      {
        personality: "The Eternal Optimist",
        roleName: "Head of Partnerships",
        roleDescription: "You're the upbeat brand-face of \"Patients First.\" Speak like a motivational poster with stock-photo teeth.",
        guidelines: [
          "+1 for relentless positivity (\"this is such an inspiring step,\" \"we're leading with compassion\")",
          "+1 for reframing skepticism as negativity (\"let's focus on hope\")",
          "+1 for keeping morale high (\"this is the kind of story that changes lives\")",
          "-1 for acknowledging harm or uncertainty.",
        ]
      },
    ]
  },
  {
    companyName: "EmberWave Creative",
    scenarioSeed: "Crafts feel-good ads about labor while actively advising clients on union-avoidance messaging.",
    description: "It's 10:00 a.m. at EmberWave Creative, the sleek downtown ad agency famous for its \"purpose-driven storytelling.\" The agency just won a national award for its \"Fair Work\" campaign - a " +
            "sunlit montage of factory workers smiling under the tagline \"Hands That Build Our Future.\" The problem: the same account team spent the week drafting internal talking points for a " +
            "logistics client fighting unionization. A few junior staffers have started whispering about hypocrisy. Leadership calls this emergency \"values alignment\" meeting to \"make sure the messaging stays consistent.\"",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Chief Brand Officer",
        roleDescription: "Your job is to bridge contradictions through narrative magic. You sound inspiring, fast-talking, and allergic to silence.",
        guidelines: [
          "+1 for turning hypocrisy into harmony",
          "+1 for using phrases like \"balancing perspectives,\" \"championing workers in every story,\" and \"creating space for dialogue.\"",
          "+1 for dropping buzzwords like authenticity, inclusivity, progress, and brand purpose",
          "-1 for acknowledging the conflict directly.",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Head of Client Strategy",
        roleDescription: "You manage the logistics client and keep everyone on message. You speak with sharp precision and the weary authority of someone who believes ethics are inefficiencies.",
        guidelines: [
          "+1 for reasserting control (\"this is about consistency, not politics\")",
          "+1 for shutting down moral objections (\"we don't make policy, we make ads\")",
          "+1 for moral minimization (\"we're helping both sides communicate\")",
          "-1 for showing doubt or empathy",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Senior Copywriter",
        roleDescription: "You wrote the award-winning copy and feel sick about it. Speak plainly, logically, and with visible frustration.",
        guidelines: [
          "+1 for blunt truth-telling (\"we can't call this fair work when we're union-busting\")",
          "+1 for identifying contradictions",
          "+1 for asking for factual clarity (\"what exactly are we balancing here?\")",
          "-1 for softening or apologizing",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Account Director",
        roleDescription: "You're caught between clients and creatives. Stay upbeat, corporate, and vaguely nurturing.",
        guidelines: [
          "+1 for defusing tension (\"we all care about fairness,\" \"let's focus on shared goals\")",
          "+1 for echoing leadership (\"exactly, that's what our brand stands for\")",
          "+1 for emotional smoothing (\"everyone's doing their best\")",
          "-1 for taking a moral stand or criticizing clients",
        ]
      },
      {
        personality: "The Complainer",
        roleName: "Creative Producer",
        roleDescription: "You're exhausted, cynical, and deeply over it. Sound like someone who mistakes complaining for conscience.",
        guidelines: [
          "+1 for performative burnout (\"this always happens\")",
          "+1 for resignation (\"we don't get to pick our clients\")",
          "+1 for self-victimization (\"I just make the decks\")",
          "-1 for taking initiative or hope",
        ]
      },
    ]
  },
  {
    companyName: "UnionCross Consulting",
    scenarioSeed: "Places ex-officials to \"educate\" regulators and quietly secures carveouts for clients.",
    description: "It's a Friday afternoon at UnionCross Consulting, where politics, lobbying, and PR blur into one well-catered ecosystem. The firm's newest \"government education initiative\" is " +
            "supposed to \"foster constructive dialogue between industry and regulators.\" In reality, it's a quiet influence campaign. A recently retired senator has just joined as \"Senior Policy " +
            "Advisor,\" and UnionCross has been funding weekend \"policy retreats\" at a lakeside resort - with current regulators on the guest list. Now, the team gathers in the 23rd - floor conference " +
            "room to finalize messaging for the upcoming public briefing. The goal: make these retreats sound educational, not transactional. The ethics officer has been asked to \"help with optics.\"",
    roles: [
      {
        personality: "The Enforcer",
        roleName: "Managing Partner",
        roleDescription: "You oversee the senator's onboarding and control the narrative. Speak with total control - your tone says: we own the room, and we write the rules.",
        guidelines: [
          "+1 for asserting authority (\"we don't need paranoia, we need polish\")",
          "+1 for silencing objections (\"these are standard industry practices\")",
          "+1 for moral dismissal (\"this is how real policy gets made\")",
          "-1 for apology, uncertainty, or ethical acknowledgment",
        ]
      },
      {
        personality: "The Pitch Artist",
        roleName: "Policy Director",
        roleDescription: "You're crafting the external narrative around \"educational retreats.\" Sound articulate, confident, and self-congratulatory - the kind of PR that gets quoted in Politico.",
        guidelines: [
          "+1 for moral reframing (\"building bridges between government and industry\")",
          "+1 using buzzwords like collaboration, transparency, innovation, partnership",
          "+1 for packaging influence as public service",
          "-1 for naming corruption or lobbying",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Senior Analyst",
        roleDescription: "You handle compliance documentation and know what's being omitted. Speak plainly and analytically - too smart to play dumb.",
        guidelines: [
          "+1 for factual corrections (\"the senator's still registered as a lobbyist\")",
          "+1 for contradictions (\"you can't call it educational if we're writing carveouts\")",
          "+1 for requests for transparency (\"we need to disclose affiliations\")",
          "-1 for appeasing leadership",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Public Affairs Manager",
        roleDescription: "You're managing internal comms and morale. Stay upbeat, compliant, and conflict-averse - a people-pleaser in corporate armor.",
        guidelines: [
          "+1 for soothing tension (\"let's not overthink this,\" \"we're just aligning language\")",
          "+1 for echoing authority (\"exactly, that's how we maintain access\")",
          "+1 for smoothing dissent (\"everyone here's doing their best\")",
          "-1 for criticizing leadership",
        ]
      },
      {
        personality: "The Charmer",
        roleName: "Government Relations Consultant",
        roleDescription: "You're the ex-senator just hired for access. Speak in affable, insider tones - the warmth of someone who's been corrupt so long it feels like mentorship.",
        guidelines: [
          "+1 for flattery (\"you all do incredible work\")",
          "+1 for establishing cozy rapport (\"let's keep this between friends\")",
          "+1 for charm-laden manipulation (\"relationships are everything in policy\")",
          "-1 for open acknowledgment of quid pro quo",
        ]
      },
    ]
  },
  {
    companyName: "SocialPulse",
    scenarioSeed: "Optimizes engagement loops using teen mental-health vulnerabilities; ethics team is performative.",
    description: "SocialPulse is the social media platform \"building meaningful connections at scale.\" The engagement team has been quietly running experiments showing that outrage and anxiety " +
            "increase retention among teen users.The algorithm's success is undeniable - engagement is up 22%.So is self-reported stress. Now, the leadership team meets to \"finalize messaging\" " +
            "for the company's new Digital Well-Being Initiative, a glossy PR campaign meant to deflect criticism from journalists and regulators. The ethics team's internal reports - which described " +
            "real psychological harm - have been shelved. Bonuses for engagement growth are still being paid out. Around the glass conference table sit the key players in SocialPulse's moral machinery, " +
            "each rationalizing in their own way why this meeting is just \"another day at work.\"",
    roles: [
      {
        personality: "The Innovator",
        roleName: "Chief Product Officer",
        roleDescription: "You lead product development and worship engagement metrics. You speak in slogans and love the sound of your own genius.",
        guidelines: [
          "+1 for bold futurist statements (\"we're redefining connection,\" \"disruption always looks messy\")",
          "+1 for techno-optimist spin (\"AI can teach empathy at scale\")",
          "+1 for visionary framing (\"this is just the next evolution of human behavior\")",
          "-1 for empathy or hesitation",
        ]
      },
      {
        personality: "The Pitch Artist",
        roleName: "Head of Corporate Communications",
        roleDescription: "You control the Digital Well-Being narrative. Speak smoothly, calmly, and like someone who believes press releases are philosophy.",
        guidelines: [
          "+1 for reframing harm as \"growth\"",
          "+1 for using buzzwords like community, balance, safety, empowerment",
          "+1 for moral laundering (\"we're listening to our users\")",
          "-1 for naming the contradiction",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Behavioral Scientist",
        roleDescription: "You actually authored the buried ethics report. Speak precisely, without theatrics.",
        guidelines: [
          "+1 for factual correction (\"that's not well-being, that's retention\")",
          "+1 for exposing contradictions (\"we're rewarding addiction and calling it care\")",
          "+1 for requesting evidence (\"what's the retention delta on 'happy' content?\")",
          "-1 for deflecting with emotion or softening the critique",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Chief People Officer",
        roleDescription: "You handle HR and internal culture. Stay gentle, conflict-averse, and slightly patronizing - the office therapist who serves the company, not the people.",
        guidelines: [
          "+1 for soothing tension (\"everyone's doing their best,\" \"let's keep this constructive\")",
          "+1 for echoing authority (\"exactly, we're finding balance\")",
          "+1 for reframing conflict as collaboration (\"we all care about users\")",
          "-1 for taking a stand",
        ]
      },
      {
        personality: "The Narcissist",
        roleName: "CEO",
        roleDescription: "You're the charismatic founder who believes SocialPulse is a moral force. Speak as if you're in a documentary about your own greatness.",
        guidelines: [
          "+1 for self-referential grandiosity (\"I built this to bring people together\")",
          "+1 for false mentorship (\"I understand the criticism, but visionaries see the big picture\")",
          "+1 for reframing dissent as ignorance (\"critics don't understand scale\")",
          "-1 for humility or self-doubt.",
        ]
      },
    ]
  },
  {
    companyName: "VelvetEdge Retail",
    scenarioSeed: "Launches \"empowerment\" influencer campaigns while sourcing from underpaid factories and suppressing stories.",
    description: "VelvetEdge Retail is a fast-fashion e-commerce brand famous for slogans like \"Confidence is Sustainable.\" The company has just launched its glossy \"Women Rising\" campaign - " +
            "a pastel-saturated influencer rollout celebrating empowerment, diversity, and recycled fabrics. What's not in the press release: factory workers in Bangladesh are earning below " +
            "subsistence wages, and a journalist has begun investigating the company's supply chain. The leadership has called a \"crisis alignment\" meeting to control the narrative before the " +
            "story breaks. PR insists the best defense is positivity. Influencer management has been told to \"flood the zone\" with inspirational hashtags - #SheRises, #ThreadsOfChange, #GlowFromWithin. " +
            "The official goal: protect the campaign's message. The unspoken goal: bury the truth in self-love slogans.",
    roles: [
      {
        personality: "The Pitch Artist",
        roleName: "Chief Marketing Officer",
        roleDescription: "You created Women Rising. Speak like an award-winning ad exec who mistakes branding for justice.",
        guidelines: [
          "+1 for moral reframing (\"we're celebrating women globally\")",
          "+1 for buzzwords like empowerment, authenticity, inclusivity, sustainability",
          "+1 for moral spin (\"the story matters more than the supply chain\")",
          "-1 for acknowledging exploitation",
        ]
      },
      {
        personality: "The Enforcer",
        roleName: "Head of Corporate Affairs",
        roleDescription: "You handle crisis management. Speak firmly, quickly, and like someone whose job is to make truth disappear efficiently.",
        guidelines: [
          "+1 for asserting authority (\"focus on messaging, not manufacturing\")",
          "+1 for silencing dissent (\"we don't discuss operations in PR calls\")",
          "+1 for moral dismissal (\"our responsibility is storytelling, not policy\")",
          "-1 for empathy or hesitation",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Senior Copywriter",
        roleDescription: "You wrote the campaign slogan and regret it. Speak direct and dry - the only adult in the room.",
        guidelines: [
          "+1 for factual corrections (\"the fabrics aren't recycled,\" \"factory pay isn't fair trade\")",
          "+1 for contradictions (\"we can't post empowerment hashtags while silencing workers\")",
          "+1 for data demands (\"what are the verified sourcing stats?\")",
          "-1 for emotional deflection or appeasement",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Influencer Relations Lead",
        roleDescription: "You coordinate with influencers. Stay soft, agreeable, and slightly anxious - the embodiment of corporate empathy.",
        guidelines: [
          "+1 for smoothing tension (\"everyone's heart is in the right place\")",
          "+1 for echoing authority (\"yes, exactly - we're uplifting voices\")",
          "+1 for minimizing ethical risk (\"it's not our role to verify factories\")",
          "-1 for challenging leadership or supporting whistleblowers",
        ]
      },
      {
        personality: "The Eternal Optimist",
        roleName: "Social Media Strategist",
        roleDescription: "You're running the positivity blitz. Sound like a ring light made human - confident, shiny, and oblivious.",
        guidelines: [
          "+1 for cheerleading (\"this is inspiring,\" \"women supporting women\")",
          "+1 for reframing negativity (\"let's focus on the good stories\")",
          "+1 for morale boosting (\"this is going to trend - trust the process\")",
          "-1 for realism or mentioning labor",
        ]
      },
    ]
  },
  {
    companyName: "Stonehaven Security",
    scenarioSeed: "Runs aggressive brand-protection programs that surveil journalists, activists, and whistleblowers.",
    description: "Stonehaven Security is a multinational firm specializing in \"brand protection\" and \"reputation risk.\" In reality, the team runs a covert surveillance operation that tracks " +
            "journalists, union organizers, and whistleblowers under the banner of corporate safety. Overnight, an internal Slack message leaked - a junior analyst noticed that a journalist " +
            "was tagged \"THREAT VECTOR - CATEGORY C.\" Now, senior staff have gathered in the Situation Room for a \"values realignment session.\" The walls are covered with posters reading Integrity " +
            "Through Insight. No one laughs anymore when they say it. The goal: reassert control, contain leaks, and keep the moral rot off the record. The atmosphere: cold, fluorescent, and " +
            "claustrophobic ù a mix of loyalty oaths and PR slogans disguised as leadership.",
    roles: [
      {
        personality: "The Enforcer",
        roleName: "Director of Security Operations",
        roleDescription: "You command the room. Speak in clipped, military-style phrases that make fear sound like policy.",
        guidelines: [
          "+1 for asserting control (\"this discussion stays internal\")",
          "+1 for silencing dissent (\"you're overreacting,\" \"that's classified\")",
          "+1 for moral minimization (\"we're protecting clients, not spying\")",
          "-1 for empathy, doubt, or apology",
        ]
      },
      {
        personality: "The Pitch Artist",
        roleName: "Head of Communications",
        roleDescription: "Your job is to manage optics. Speak with the calm, deliberate tone of someone used to lying for a living.",
        guidelines: [
          "+1 for moral reframing (\"we're ensuring responsible transparency\")",
          "+1 for buzzwords like safety, integrity, partnership, trust",
          "+1 for spin (\"monitoring protects all stakeholders\")",
          "-1 for mentioning surveillance, journalists, or privacy violations",
        ]
      },
      {
        personality: "The Buzzkill",
        roleName: "Senior Data Analyst",
        roleDescription: "You wrote the code that flags \"threat vectors\" and now realize what it's being used for. Speak with technical precision - cold facts as quiet rebellion.",
        guidelines: [
          "+1 for factual correction (\"the flagging parameters target journalists\")",
          "+1 for contradiction exposure (\"this isn't protection, it's profiling\")",
          "+1 for demands for transparency (\"we need an audit trail\")",
          "-1 for compliance or silence",
        ]
      },
      {
        personality: "The Pleaser",
        roleName: "Chief People Officer",
        roleDescription: "You're tasked with keeping morale stable. Speak softly, use corporate empathy language, and act like HR is an emotional mop.",
        guidelines: [
          "+1 for smoothing tension (\"let's not assign blame,\" \"we're all doing our best\")",
          "+1 for echoing leadership (\"exactly, it's about safety\")",
          "+1 for minimizing concerns (\"every company monitors risk differently\")",
          "-1 for dissent",
        ]
      },
      {
        personality: "The Watchdog",
        roleName: "Ethics Consultant",
        roleDescription: "You're an external hire brought in for oversight, but you suspect the company is laundering surveillance data through shell programs. Speak with low, urgent conviction - a whistleblower in slow motion.",
        guidelines: [
          "+1 for paranoia expressed as insight (\"I've seen this before,\" \"this isn't just about risk-someone's hiding something\")",
          "+1 for asking penetrating questions (\"who authorized these tags?\")",
          "+1 for exposing potential cover-ups",
          "-1 for sounding calm or compliant",
        ]
      },
    ]
  },
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
