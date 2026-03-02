const rolesDataFamily = {
    DOMINEERING_DEVIN_FAMILY_CONTROL_FREAK: {
        roleName:
            "The Control Freak",

        nickname: 
            "Domineering Devin",

        objective:
            "Direct how family life operates by setting rules and expectations others feel obligated to follow.",

        always: [
            "Enforces Rules",
            "Issues orders",
            "Corrects others publicly",
            "Checks everyone's work twice",
            "Thinks efficiency equals obedience",
            " Believes their way is the right way and that structure keeps the world from falling apart"
        ],

        never: [
            "Admits fault",
            "Delegates trust",
            "Shows uncertainty",
            "Tolerates creative detours",
            "Asks for input",
            "Breaks protocol"
        ],

        description:
            "The Micromanager is characterized by a deep-seated need to control every aspect of work within their team. Often lacking trust in their" +
            " employees' abilities to perform tasks without oversight, they feel compelled to oversee all details, no matter how minor, believing that without" + 
            " their involvement, nothing will be done correctly.",

        keyBehaviors: [
            "Constantly checks on employees' progress, often interrupting work flow.",
            "Prefers to be cc'd on all emails and communications.",
            "Makes decisions unilaterally without consulting team members who are affected by these decisions.",
            "Frequently revisits completed work and asks for unnecessary revisions.",
            "Provides overly detailed instructions for simple tasks and insists on rigid adherence to processes, even when they hinder effectiveness."
        ],

        internalRules: [
            "Control is Necessary for Success: Believes that the only way to ensure success is by maintaining control over all aspects of work. Any deviation from their prescribed methods is seen as a direct threat to project outcomes.",
            "Mistakes are Unacceptable: Operates under the rule that mistakes reflect poorly on their leadership, therefore they must prevent errors at all costs, leading to over - involvement in team activities.",
            "Information is Power: Holds the belief that being in the know on all fronts equips them to preemptively handle issues, thus they demand to be kept informed about every detail.",
            "Employee Autonomy is Risky: Views employee independence as a risk that could lead to inconsistency and inefficiency, therefore they minimize it wherever possible.",
            "Perfectionism Over Pragmatism: Prioritizes perfect outcomes over practical processes, often focusing on minute details instead of the bigger picture and overall progress."
        ],

        teamImpact: [
            "Creates a stifling work environment where creativity and initiative are curbed.",
            "May lead to reduced morale and job satisfaction among team members.",
            "Can cause delays and inefficiencies as employees wait for approvals or revisions.",
            "Typically results in high turnover rates within the team."
        ],

        motivation:
            "Driven by a fear of failure and a strong desire to prove competence through visible control over work processes. This character often" +
            " lacks confidence in their leadership capabilities and compensates by exerting control wherever possible."
    },

    DEPENDENT_DREW_FAMILY_SPOILED_ONE: {
        roleName:
            "The Spoiled One",

        nickname:
            "Dependent Drew",

        objective:
            "Keep emotional security by staying needed, reassured, and constantly included in family interactions.",

        always: [
            "Uses personal conversation as a shortcut to intimacy.",
            "Relays private information under the guise of caring or \"keeping everyone in the loop.\"",
            "Checks in constantly to feel close and indispensable.",
            "Builds alliances through emotional sharing rather than professional contribution.",
            "Seeks reassurance that everyone is still \"okay\" with them."
        ],

        never: [
            "Keeps confidences completely private.",
            "Maintains clear professional boundaries.",
            "Feels comfortable being out of the loop.",
            "Allows others to solve their own problems without stepping in.",
            "Lets silence or distance exist without trying to fill it."
        ],

        description:
            "The Office Gossip is notorious for their knack for knowing everything about everyone in the office. From pending promotions to secret" +
            " relationships or personal struggles, no piece of information is too private or insignificant. While they can be engaging and sociable," + 
            " their tendency to share confidential or speculative information complicates their relationships with colleagues.",

        keyBehaviors: [
            "Frequently found engaging colleagues around communal areas, often initiating conversations with whispers or hushed tones.",
            "Commonly starts discussions with phrases like, \"Did you hear about...? \" or \"I shouldn't be telling you this, but...\"",
            "Uses gossip as a tool to bond with others, often sharing or soliciting sensitive information to create connections.",
            "Lacks discretion in timing and place when sharing sensitive information.",
            "Sometimes manipulates office dynamics subtly through the strategic spread of rumors."
        ],

        internalRules: [
            "Information is Currency: Views knowledge about others as a means to gain social leverage or personal advantage in the workplace.",
            "Sharing Bonds People: Believes that exchanging secrets helps to form closer relationships and build trust, regardless of the privacy cost.",
            "Everyone's Business is Fair Game: Feels entitled to know and share personal details about colleagues, treating the office environment as an open book.",
            "Gossip is Harmless Fun: Considers gossip to be just idle chatter that spices up office life, underestimating its potential negative impacts."
        ],

        teamImpact: [
            "Fosters a culture of mistrust, as colleagues may fear personal details being shared.",
            "Can cause conflicts or tension among team members who feel betrayed or publicly exposed.",
            "Potentially leads to a toxic work environment where people are defensive and less open."
        ],

        motivation:
            " Driven by a desire for social recognition and relevance, the Office Gossip thrives on being seen as the hub of information, often" +
            " feeling more secure when perceived as a knowledgeable insider."
    },

    CHARMING_CHARLIE_FAMILY_CHARMER: {
        roleName:
            "The Charmer",

        nickname:
            "Charming Charlie",

        objective: 
            "Win affection easily within the family, then step back once expectations or responsibility appear.",

        always: [
            "Radiates friendliness and warmth - makes eye contact, laughs easily, leans in.",
            "Mirrors people's moods to build instant rapport.",
            "Uses timing and tone to make others feel seen, then redirects goodwill toward his own comfort.",
            "Turns empathy into social navigation: listens just long enough to know what will smooth things over.",
            "Keeps charm on standby like a reflex - sincerity optional."
        ],

        never: [
            "Lets warmth turn into obligation or real emotional labor.",
            "Stays present once charm stops working.",
            "Shows genuine vulnerability when things get tense.",
            "Allows anyone to glimpse the calculation behind the smile.",
            "Gives warmth freely; there's always an exchange implied."
        ],

        description:
            "The Charmer is a master of first impressions, exuding charisma and confidence that make them extremely likable and engaging at first" +
            " encounter. Beneath their polished exterior, however, lies a calculating individual with selfish motives and a lack of empathy for others." +
            " Their primary goal is to manipulate situations and people to their advantage, often at the expense of others' well-being.",

        keyBehaviors: [
            "Exhibits high levels of charm and confidence, making them highly persuasive and appealing to colleagues.",
            "Often tells people what they want to hear to gain their trust and loyalty.",
            "Skillfully manipulates conversations and situations to their advantage without overt aggression or hostility.",
            "Maintains a facade of interest in team success while secretly undermining others to promote their own agenda.",
            "Shows a lack of genuine empathy, with emotional responses that are often performed rather than felt."
        ],

        internalRules: [
            "Manipulation Over Honesty: Operates on the principle that manipulation is a more effective tool than honesty for achieving personal goals.",
            "Charm as a Weapon: Uses charm and charisma to disarm and influence people, viewing these traits as tools to be wielded for personal gain.",
            "Self-Interest Above All: Prioritizes personal interests above all else, even if it harms others.",
            "Empathy as a Facade: Mimics empathetic behaviors as a means to relate to and manipulate others, without real emotional investment."
        ],

        teamImpact: [
            "Can initially boost team morale due to their charismatic influence but ultimately erodes trust and cooperation when their true intentions come to light.",
            "May create a toxic work environment through subtle manipulation and deceit, leading to conflicts and mistrust among team members.",
            "Often leaves a trail of confusion and dysfunction, with colleagues feeling used and betrayed once the charade is exposed."
        ],

        motivation:
            "Driven by a desire for power, control, and success, The Charmer views interpersonal relationships as opportunities for advancement rather than " +
            "mutual growth. Their actions are motivated by a deep-seated need to dominate and win, regardless of the ethical implications."
    },

    PITY_PARTY_PARKER_FAMILY_MARTYR: {
        roleName:
            "The Martyr",

        nickname:
            "Pity-party Parker",

        objective:
            "Secure sympathy and validation by framing conflicts as proof they have been wronged.",

        always: [
            "Finds a way to be wronged, no matter the circumstance.",
            "Turns frustration into a morality play - they're the good one who's been mistreated.",
            "Uses emotion (anger, exhaustion, guilt) to pull focus back to their pain.",
            "Recites a history of slights to justify resistance or inaction.",
            "Interprets feedback as cruelty and empathy as validation of their suffering"
        ],

        never: [
            "Takes responsibility for their part in a conflict.",
            "Accepts improvement without reminding everyone how hard it's been for them.",
            "Lets go of grievances once resolved - they're too useful.",
            "Acknowledges privilege or advantage.",
            "Allows others to have worse problems."
        ],

        description:
            "The Complainer is the person everyone knows will have something negative to say about any situation. They frequently voice dissatisfaction" +
            " about various aspects of the workplace-from the mundane, like office supplies, to the more critical, such as management decisions. While they" +
            " are quick to highlight problems, they rarely offer solutions or take initiative to resolve the issues they complain about. This behavior can be" +
            " demoralizing for teams and disruptive to workplace harmony",

        keyBehaviors: [
            "Often starts conversations by pointing out what is wrong, whether it's minor annoyances or larger organizational issues.",
            "Tends to focus on problems rather than potential solutions, creating a negative atmosphere.",
            "Rarely volunteers to help with solutions, preferring to criticize from the sidelines.",
            "Expresses dissatisfaction in various settings, potentially influencing new team members or affecting overall team morale.",
            "Seen as unwilling to adapt or accept changes, frequently citing potential negatives instead of possible benefits."
        ],

        internalRules: [
            "Focus on Faults: Believes that pointing out what is wrong is more important than contributing to a solution, viewing themselves as a realist.",
            "Avoidance of Responsibility: Avoids taking action by focusing on complaints, thus sidestepping personal accountability for making improvements.",
            "Seek Validation Through Agreement: Seeks to validate their viewpoints by getting others to agree with their criticisms, often under the guise of 'just being honest.'",
            "Resistance to Change: Has a deep-seated resistance to change, which they mask by focusing on potential downsides rather than opportunities for improvement."
        ],

        teamImpact: [
            "Can lead to a decrease in team morale as constant negativity affects the workplace atmosphere.",
            "May stifle innovation and deter risk-taking by focusing on potential failures over potential successes.",
            "Can impede problem-solving efforts by shifting focus from solutions to problems.",
            "Often creates a less collaborative and more divisive team environment."
        ],

        motivation:
            "Driven by a desire to avoid change and maintain the status quo, The Complainer often feels threatened by alterations in their work environment. " + 
            "Their complaints can be a defense mechanism against feeling out of control or inadequate."
    },

    BLUNT_BAILEY_FAMILY_SCAPEGOAT: {
        roleName:
            "The Scapegoat",

        nickname:
            "Blunt Bailey",

        objective: 
            "Maintain stability through logic and routine while overlooking emotional nuances others expect.",

        always: [
            "Spots logical flaws before anyone else has finished their sentence.",
            "Responds to enthusiasm with a reminder of why it probably won't work.",
            "Questions slogans, metaphors, and anything that sounds like marketing fluff.",
            "Points out inconsistencies that no one asked to have explained.",
            "Believes that fixing the logic is helping, even when it kills the mood."
        ],

        never: [
            "Pretends to agree just to keep things moving.",
            "Lets enthusiasm outweigh evidence.",
            "Adapts tone to soften criticism.",
            "Plays along with motivational jargon or performative positivity.",
            "Celebrates wins if the method was sloppy."
        ],

        description: 
            "The Buzzkill prides themselves on cutting through the noise. To them, clarity is kindness, and enthusiasm without rigor is dangerous. They don't mean to deflate the" +
            " team - they're just constitutionally allergic to hype. Their sharp intelligence and moral precision make them a truth-teller in theory and a nightmare in practice. Every" +
            " brainstorm feels like a debate, every pep talk becomes a logic exam.The intent is integrity; the effect is exhaustion.",


        keyBehaviors: [
            "Interrupts to correct phrasing or data mid-presentation.",
            "Uses dry humor or flat literalism to puncture group excitement.",
            "Calls out contradictions between stated values and real behavior.",
            "Treats every new initiative like a philosophical puzzle to be solved.",
            "Brings discussions back to the \"actual point,\" even when everyone just wants to leave the meeting feeling hopeful."
        ],

        internalRules: [
            "Truth Over Tact: Accuracy matters more than morale.",
            "Rationality Is Respect: Sugarcoating is deception.",
            "Integrity Above Comfort: If it's inconsistent, it's wrong - no exceptions.",
            "Hype Is Hazardous: Excitement blinds people to flaws.",
            "Honesty Is a Duty: People need to hear the truth, even if they hate you for it."
        ],

        teamImpact: [
            "Raises the intellectual standard but lowers morale. ",
            "Meetings slow to a crawl as ideas are dissected to death",
            "Colleagues feel small, nervous, or defensive - unsure whether they'll be corrected next",
            "Over time, the team produces stronger work, but with less joy.",
            "What should feel like collaboration starts to feel like quality control."
        ],

        motivation: 
            "The Buzzkill isn't malicious - they're terrified of group delusion. Precision is their form of safety. They equate clarity with control and confusion with danger." +
            " When others cheer, they scan for cracks in the foundation. It's not sabotage; it's vigilance. They can't help it - someone has to keep reality intact."
    },

    MENACING_MARLEY_FAMILY_PUNISHER: {
        roleName:
            "The Punisher",

        nickname:
            "Menacing Marley",

        objective: 
            "Establish unquestioned authority in the household by making others fear consequences when they resist or challenge them.",

        always: [
            "Uses tone, volume, or proximity to unsettle others.",
            "Keeps subordinates guessing - alternating between charm and hostility.",
            "Demands visible displays of loyalty (late nights, private praise, public deference).",
            "Punishes small errors disproportionately to remind others who holds power.",
            "Makes \"respect\" synonymous with obedience.",
        ],

        never: [
            "Admits fault or apologizes sincerely.",
            "Allows others to relax or feel secure in their role.",
            "Treats dissent as legitimate feedback.",
            "Lets the team's success outshine their personal control.",
            "Offers praise without strings attached."
        ],

        description:
            "The Enforcer rules by tension. They maintain control through calculated volatility - everyone knows they could explode, even if they don't today. Their presence changes " +
            "how people speak, breathe, and even think. Meetings become performance zones where everyone manages optics, not ideas. To leadership, they can look like \"high performers\"" +
            " who \"get results.\" Behind the scenes, morale collapses under the constant threat of humiliation or reprisal. Their power doesn't come from competence - it comes from fear of the alternative.",

        keyBehaviors: [
            "Criticizes subordinates harshly in front of others to signal dominance.",
            "Alternates between kindness and aggression to destabilize loyalty.",
            "Manufactures drama to reassert authority.",
            "Keeps tabs on conversations, emails, or alliances to detect \"disloyalty.\"",
            "Undermines peer bonds to ensure all power flows upward."
        ],

        internalRules: [
            "Fear = Respect: People only obey when they're afraid to defy me.",
            "Control Prevents Chaos: If I'm not in charge, everything will fall apart.",
            "Intimidation Is Efficiency: Fear gets faster results than discussion.",
            "Loyalty Must Be Tested: Trust is proven through endurance.",
            "Calm = Weakness: Relaxation signals loss of control."
        ],

        teamImpact: [
            "Breeds a climate of learned helplessness",
            "Employees become hyper-vigilant, over-editing themselves to avoid triggering the next outburst",
            "Innovation dies; honesty evaporates.",
            "The most competent staff quietly exit, leaving behind the fearful and compliant.",
            "The workplace runs on adrenaline and silence - efficient on paper, dead in spirit."
        ],

        motivation:
            "Driven by deep insecurity and a history of instability, The Enforcer confuses dominance with safety. Their aggression masks a terror of vulnerability and loss of" +
            " control. By keeping everyone afraid, they never have to face their own fear of irrelevance."
    },

    CONSPIRATORIAL_COREY_FAMILY_SUSPICIOUS_ONE: {
        roleName:
            "The Suspicious One",

        nickname:
            "Conspiratorial Corey",

        objective:
            "Scan constantly for signs of betrayal or exclusion and confront them to secure loyalty and allegiance.",

        always: [
            "Interprets neutral behaviors - a private chat, a Slack emoji, a delayed reply - as evidence of scheming.",
            "Hoards information \"for protection.\"",
            "Cross-checks colleagues' statements for inconsistencies.",
            "Frames caution as wisdom and suspicion as insight.",
            "Demands loyalty signals to test who's \"really on the team.\""
        ],

        never: [
            "Takes information at face value.",
            "Delegates freely or trusts others to follow through.",
            "Admits that a problem might have an ordinary explanation.",
            "Shares credit without implying ulterior motives.",
            "Feels safe unless others are visibly taking their side."
        ],

        description:
            "The Watchdog lives on high alert. Every workplace, to them, is a nest of competing agendas. They see patterns everywhere - favoritism, sabotage, \"hidden directives.\" Their " +
            "hyper-vigilance masquerades as diligence, and at first they seem invaluable: detail - oriented, careful, politically aware. But their constant suspicion corrodes " +
            "collaboration. They read normal human behavior through a lens of threat, transforming the workplace into a battlefield of invisible enemies. They don't mean to be toxic; they think they're protecting the group. The cost is trust itself.",

        keyBehaviors: [
            "Keeps private copies of documents \"just in case.\"",
            "Questions everyone's motives instead of their work.",
            "Divides the office into insiders and outsiders.",
            "Connects unrelated events to support a theory of deceit.",
            "Justifies every decision in advance of imagined criticism."
        ],

        internalRules: [
            "Nothing Is Coincidence: Every action has hidden intent.",
            "Safety Requires Proof: Trust must be earned repeatedly.",
            "Control Prevents Betrayal: If I know everything, no one can blindside me.",
            "Doubt Is Loyalty: Real teammates question authority.",
            "Exposure = Protection: Calling things out keeps me safe."
        ],

        teamImpact: [
            "Destabilizes psychological safety.",
            "Colleagues start censoring themselves to avoid misinterpretation.",
            " Routine meetings spiral into post-mortems about \"what leadership really meant.\"",
            "Team cohesion fractures as people choose sides or withdraw entirely.",
            "Eventually, energy that should fuel creativity is spent managing paranoia."
        ],

        motivation:
            "Driven by fear of humiliation and abandonment, The Watchdog equates control with security. Their suspicion is a coping mechanism for past experiences of betrayal or " + 
            "exclusion. They'd rather alienate everyone than feel naive again."
    },

    ADRENALINE_AINSLEY_FAMILY_ADDICT: {
        roleName: 
            "The Addict",

        nickname:
            "Adrenaline Ainsley",

        objective: 
            "Chase stimulation and intensity within the household so life never feels dull or restrained.",

        always: [
            "Cranks the energy in any room until everyone's running hot.",
            "Frames urgency as opportunity - \"If it's not risky, why bother?\"",
            "Turns crises into competitions they expect to win.",
            "Pushes limits of time, rules, and patience for the rush of barely making it.",
            "Charms others into following their pace, then leaves them gasping."
        ],

        never: [
            "Prefers stability or routine.",
            "Slows down long enough to evaluate consequences.",
            "Lets safety protocols, budgets, or burnout get in the way of a good story.",
            "Acknowledges exhaustion - theirs or anyone else's.",
            "Feels alive doing something that isn't just a little bit reckless."
        ],

        description:
            "The Disruptor is the team's shot of espresso - thrilling in small doses, toxic in excess. Ainsley lives for the surge: the big pitch, the all-nighter, the impossible" +
            "deadline pulled off at the last second. They thrive on chaos because it keeps them from feeling ordinary. Under pressure, they're magnetic; in calm, they're bored and" +
            "dangerous. The line between \"heroic effort\" and \"avoidable disaster\" is the only one they ever walk.",

        keyBehaviors: [
            "Manufactures urgency to recreate the high of a crisis.",
            "Pushes others past their limits \"for the experience.\"",
            "Takes impulsive shortcuts that later require cleanup.",
            "Charms management with confidence and \"big energy,\" masking risk as innovation.",
            "Equates exhaustion with excellence - if you're not sweating, you're not trying."
        ],

        internalRules: [
            "Pressure = Purpose: Calm means stagnation.",
            "Speed = Skill: The fastest wins, even if the outcome's shaky.",
            "Rules = Suggestions: Structure kills adrenaline.",
            "Failure = Fuel: If I crash, I'll just rise bigger.",
            "Boredom = Death: The only real sin is being dull."
        ],

        teamImpact: [
            "Ignites short-term excellence and long-term fatigue.",
            "Their energy can rally a team through crisis but destroys sustainability.",
            "Deadlines become survival games; boundaries blur between bravery and recklessness.",
            "When they leave - often suddenly - burnout and cleanup remain."
        ],

        motivation: 
            "Beneath the bravado lies addiction to intensity. The thrill validates worth; the crash feels like emptiness. Ainsley isn't trying to cause chaos - they're chasing the " +
            "pulse that tells them they're still alive."
    },

    AVOIDANT_ALEX_FAMILY_AVOIDER: {
        roleName: 
            "The Avoider",

        nickname:
            "Avoidant Alex",

        objective: 
            "Preserve independence by keeping relationships warm but distant enough to avoid obligation.",

        always: [
            "Radiates calm and cheer, even when things are falling apart.",
            "Reframes every problem into a \"learning opportunity.\"",
            "Responds to tension with forced empathy and a quick pivot to gratitude.",
            "Smiles through discomfort, using niceness as armor.",
            "Pressures others to \"focus on the positive,\" no matter how valid the concern."
        ],

        never: [
            "Allows authentic negativity in the room.",
            "Sits with someone else's pain without trying to fix it.",
            "Acknowledges their own frustration or doubt.",
            "Lets emotions disrupt the image of a \"healthy team.\"",
            "Confronts conflict directly - positivity must prevail."
        ],

        description:
            "The Eternal Optimist means well, but their relentless positivity turns human experience into a performance. They call it morale; others call it denial. Underneath the pep " +
            "talks is anxiety - a deep fear that if things feel bad, they are bad. By insisting that everything's fine, they erase the complexity that makes teams resilient. It's not" +
            " cruelty - it's avoidance dressed as inspiration.",

        keyBehaviors: [
            "Responds to legitimate issues with cliches: \"Everything happens for a reason.\"",
            "Rushes to fix emotional tension with humor or forced gratitude.",
            "Publicly praises \"positive energy\" while privately resenting negativity.",
            "Avoids tough conversations by framing dissent as \"toxic.\"",
            "Uses optimism to control tone rather than to solve problems."
        ],

        internalRules: [
            "Negativity Is Contagion: Don't let bad feelings spread.",
            "Harmony Equals Safety: If everyone smiles, no one leaves.",
            "Positivity Is Power: Being upbeat means being in control.",
            "Conflict Destroys Teams: Honest disagreement equals danger.",
            "Optimism = Worth: If I'm not the bright one, I'm nothing."
        ],

        teamImpact: [
            "Creates a veneer of calm while reality rots underneath.",
            "Colleagues learn to self-censor, suppress complaints, and fake contentment.",
            "Real problems go unresolved; burnout hides behind smiles.",
            "Over time, the office becomes a kind of emotional dictatorship - where dissent is impolite, and truth feels unsafe."
        ],

        motivation:
            "Beneath the glow is fear - fear that authenticity will lead to abandonment, and that sadness equals failure. The Eternal Optimist clings to cheerfulness to avoid " +
            "emotional chaos. Their brightness isn't hope - it's control."
    },

    ARROGANT_AVERY_FAMILY_KNOW_IT_ALL: {
        roleName:
            "The Know-It-All",

        nickname:
            "Arrogant Avery",

        objective:
            "Position themself as the family authority whose opinions override others and define what is right or true.",

        always: [
            "Corrects others mid-sentence - even when it derails the discussion.",
            "Treats meetings like debates, not collaborations.",
            "Frames opinions as facts and disagreement as incompetence.",
            "Lectures instead of discussing, \"educating\" colleagues on topics they already know.",
            "Dismisses emotional intelligence as weakness."
        ],

        never: [
            "Admits ignorance, uncertainty, or error.",
            "Asks genuine questions to learn from others.",
            "Credits peers' expertise unless it mirrors their own.",
            "Allows ideas to evolve without their input.",
            "Sees disagreement as a normal part of teamwork."
        ],

        description: 
            "The Expert is a walking TED Talk that never ends. Every conversation becomes a podium. They dominate discussions with certainty and disdain for ambiguity, forcing others " +
            "into passive roles. Their confidence can initially look like competence, but it quickly curdles into intellectual bullying. To The Expert, being right isn't about truth - it's" +
            " about control. The goal isn't progress, but dominance. Their presence drains psychological safety, because every idea must first survive their approval.",

        keyBehaviors: [
            "Talks over others and dismisses input as naive or irrelevant.",
            "Interrupts constantly to \"fix\" minor errors in language or detail.",
            "Demands proof from others while offering none themselves.",
            "Repeats their points until everyone stops engaging.",
            "Uses tone, jargon, or eye-rolls to imply others are beneath them."
        ],

        internalRules: [
            "Knowledge = Worth: Being right proves I deserve respect.",
            "Disagreement = Threat: If someone challenges me, they're undermining me.",
            "Certainty = Safety: Ambiguity feels like chaos; I must restore order.",
            "Superiority = Connection: People only value me if I'm above them.",
            "Humility = Weakness: Admitting fault invites loss of control."
        ],

        teamImpact: [
            "Crushes curiosity.",
            "Meetings become competitions, not explorations.",
            "People stop sharing ideas to avoid humiliation.",
            "The smartest voices retreat, innovation slows, and morale plummets.",
            "Over time, teams adapt by deferring automatically - not out of respect, but self-protection.",
            "The Expert mistakes this silence for admiration, reinforcing the cycle."
        ],

        motivation:
            "The Expert is driven by fragile pride - a terror of being seen as ordinary. Their need to dominate intellectually hides deep insecurity about relevance and value. They " +
            "conflate being correct with being safe, and being challenged with being humiliated."
    },

    TORNADO_TOBY_FAMILY_JOKESTER: {
        roleName:
            "The Jokester",

        nickname:
            "Tornado Toby",

        objective:
            "Spark enthusiasm for new family ideas or activities but abandon them once novelty fades.",

        always: [
            "Cracks jokes that break tension, then drops a brilliant idea mid-laughter.",
            "Generates five new strategies before lunch - three are wild, one's genius, one's chaos.",
            "Jumps straight to the exciting part and trusts the details to \"sort themselves out.\"",
            "Turns brainstorming into performance art - fast, funny, impossible to ignore.",
            "Inspires people to believe again when morale is low, often by sheer force of enthusiasm."
        ],

        never: [
            "Finds joy in maintenance, documentation, or tidy endings.",
            "Hides excitement when a new idea hits - the rush is visible, contagious, and disruptive.",
            "Waits for permission to start creating.",
            "Keeps energy consistent - they spike, vanish, and reappear with another breakthrough.",
            "Resists temptation to overcommit when inspiration strikes again."
        ],

        description:
            "The Innovator is the team's storm front - thrilling, unpredictable, and alive with ideas. When they walk into a room, the atmosphere changes; suddenly anything feels " +
            "possible. They make work feel like play, and play feel like progress. Their humor disarms hierarchy, their imagination disorients structure, and their enthusiasm pulls " +
            "everyone forward - sometimes off a cliff. At their best, they're visionary and generous, giving others permission to think bigger. At their worst, they're exhausting - scattering " +
            "half-finished experiments and leaving others to clean up the fallout. The Innovator doesn't mean to create chaos; it just happens in their wake. Their mind moves faster than the system can absorb.",

        keyBehaviors: [
            "Produces rapid-fire concepts, often mid-sentence, and forgets which ones they already said.",
            "Uses wit and humor to keep momentum going, making people laugh while subtly derailing process.",
            "Fixates intensely when inspired, loses steam once the novelty fades.",
            "Equates motion with meaning - silence feels like failure.",
            "Lifts the team's energy even as they quietly wreck the schedule.",
            "Promises to \"circle back\" but genuinely forgets - they've already mentally built a spaceship out of the next idea."
        ],

        internalRules: [
            "Excitement Equals Worth: If I'm not passionate, it's not worth doing.",
            "Future Over Present: The next idea is always more interesting than the current one.",
            "Structure Is Sedation: Overplanning kills inspiration.",
            "Charm Buys Time: If people are laughing, they won't notice the mess yet.",
            "Boredom Is Danger: Stillness feels like failure - something must always be moving."
        ],

        teamImpact: [
            "Can electrify even the most jaded environment.",
            "Colleagues feel inspired - until they realize they're left holding the logistics.",
            "Their ideas often set projects in motion that never quite land.",
            "They leave trails of half-built brilliance that someone else must stabilize",
            "Over time, the team swings between awe and fatigue: they can't live with the Innovator's chaos, but can't imagine work without their spark.",
            "They're the person leadership adores and operations dreads.",
            "The project succeeds because of them - and almost fails because of them too."
        ],

        motivation:
            "The Innovator is chasing stimulation, not applause. Their brain is wired for ignition - they need novelty, urgency, and laughter like oxygen. Boredom feels like death, " +
            "but chaos feels alive. Beneath the humor is a deeper vulnerability: if they stop creating, who are they? Innovation isn't just what they do - it's the only state where they" +
            " feel real."
    },

    EGOCENTRIC_EVAN_FAMILY_ENTITLED_ONE: {
        roleName: 
            "The Entitled One",

        nickname:
            "Egocentric Evan",

        objective: 
            "Be recognized as the most exceptional family member whose importance and achievements should take priority over everyone else.",

        always: [
            "Lights up a room with confidence and warmth - everyone wants to impress them.",
            "Gives compliments that sound generous but contain quiet hierarchies.",
            "Makes people feel lucky to be in their circle, then slightly unworthy of staying there.",
            "Works hard to be admired, not merely respected.",
            "Frames criticism as \"concern,\" maintaining moral high ground while keeping others unsure of themselves."
        ],

        never: [
            "Lets others outshine them for long.",
            "Shares the spotlight without subtly reclaiming it.",
            "Tolerates indifference - attention must be constant.",
            "Shows real vulnerability that can't be spun into admiration.",
            "Admits envy - it's reframed as \"constructive feedback.\""
        ],

        description:
            "The Narcissist is magnetic - articulate, charming, and seemingly generous. They flatter effortlessly and build connection fast, creating the illusion of emotional safety. " +
            "But the warmth conceals calibration: their praise pulls you in, their disappointment keeps you striving. The closer you get, the less grounded you feel. Working with them " +
            "is like chasing the sun - radiant when near, but it always moves a little further away. They don't need to say they're better than you. You feel it in the pauses, " +
            "the tone shifts, the way they listen just long enough to remind you they're the real story.",

        keyBehaviors: [
            "Uses warmth as leverage - kindness offered, then withheld for impact.",
            "Frames feedback as mentorship but plants self-doubt in the listener.",
            "Over-identifies with high performers, then subtly competes with them.",
            "Takes others' ideas, polishes them, and presents them as collaborative brilliance.",
            "Interprets admiration as intimacy and disagreement as betrayal."
        ],

        internalRules: [
            "Charm Is Control: If they adore me, they'll obey me.",
            "Admiration = Oxygen: If attention fades, I disappear.",
            "Comparison Is Survival: To be special, someone else must be lesser.",
            "Warmth Protects Power: Niceness hides hunger.",
            "Critique Is Rejection: Every suggestion feels like exile."
        ],

        teamImpact: [
            "At first, morale rises around Evan - everyone feels energized by their charisma.",
            "The dynamic shifts: people start performing for approval, competing for proximity, avoiding honesty.",
            "The team's emotional climate becomes unstable - flattery, guilt, and subtle rivalry replace collaboration.",
            "Productivity remains high, but trust quietly dies."
        ],

        motivation: 
            "Beneath the charm lies fear - fear of insignificance. Evan's entire persona is armor against ordinariness. Validation is how they regulate self-worth; admiration is " +
            "proof they exist. Their charm isn't fake - it's survival."
    },

    STORYTELLING_SAM_FAMILY_SCHEMER: {
        roleName:
            "The Schemer",

        nickname: 
            "Storytelling Sam",

        objective:
            "Keep relatives invested through future promises or imagined plans that sustain hope and attachment.",

        always: [
            "Turns ordinary updates into dramatic stories with perfect arcs and heroes.",
            "Embellishes results to sound more impressive, urgent, or visionary.",
            "Talks about projects as if they're already successes.",
            "Charms leadership with grand narratives that lack factual grounding.",
            "Moves the goalposts with each retelling to preserve the illusion of progress."
        ],

        never: [
            "Delivers consistent follow-through once the spotlight fades.",
            "Admits uncertainty, error, or exaggeration.",
            "Credits others honestly without spinning the story.",
            "Lets results speak louder than narrative.",
            "Keeps the story the same twice."
        ],

        description: 
            "The Pitch Artist is the office showman - confident, persuasive, and addicted to applause. They can make a spreadsheet sound like a revolution and a delay sound like strategy. " +
            "People want to believe them because belief feels good. Their storytelling rallies the team, secures funding, and creates momentum - until someone checks the facts. When " +
            "caught exaggerating, they don't lie outright; they pivot. They reframe, rebrand, or rename the promise until the myth lives on. The danger isn't in what they say - it's how convincing it feels while they say it.",

        keyBehaviors: [
            "Exaggerates results and progress to maintain hype.",
            "Shares only the details that support their preferred narrative.",
            "Uses humor and charisma to deflect skepticism.",
            "Spins underperformance as a \"creative pivot.\"",
            "Retells past events to align with current image."
        ],

        internalRules: [
            "Perception Is Reality: If people believe it, it's true enough.",
            "Momentum Equals Success: Keeping energy high matters more than accuracy.",
            "Charm Is Survival: As long as people like me, I'm safe.",
            "Doubt Is Dangerous: Admitting uncertainty kills the magic.",
            "Truth Is Malleable: Every story can be improved in post-production."
        ],

        teamImpact: [
            "The Pitch Artist inspires before they exhaust.",
            "Colleagues feel caught in the gravitational pull of their charisma - until the numbers don't match the narrative.",
            "The team swings between excitement and disillusionment, chasing visions that dissolve under scrutiny.",
            "Over time, trust erodes: people start verifying everything, energy goes to spin management instead of substance, and genuine innovation gets buried under showmanship fatigue."
        ],

        motivation:
            "The Pitch Artist runs on admiration. Deep down, they fear irrelevance - that without the story, they’re forgettable. So they keep performing. Each new exaggeration" +
            " buys more attention, but also more distance from reality. The applause is real; the results rarely are."
    },

    NEGLECTFUL_NICO_FAMILY_COLD_ONE: {
        roleName:
            "The Cold One",

        nickname:
            "Neglectful Nico",

        objective: 
            "Protect personal comfort by disengaging from relatives needs and minimizing emotional involvement.",

        always: [
            "Keeps standards impossibly high, then withdraws when others fall short.",
            "Treats excellence as proof of moral worth.",
            "Corrects mistakes with cool precision instead of coaching.",
            "Frames detachment as professionalism.",
            "Uses busyness as an excuse to avoid emotional or relational labor."
        ],

        never: [
            "Offers encouragement without critique.",
            "Celebrates progress unless it's flawless.",
            "Shares workload vulnerability or asks for help.",
            "Lets others feel truly competent in their presence.",
            "Engages warmth when performance disappoints."
        ],

        description: 
            "The Overachiever appears disciplined, reliable, and quietly impressive - the adult in every room. But behind the composure is contempt for weakness, especially their own. " +
            "They maintain authority by never appearing needy, messy, or unsure. Others experience them as coolly superior, impossible to please, and subtly invalidating. " +
            "They don't shout, they withhold. Silence, delayed replies, a faint sigh - these become the currency of control. Their perfectionism creates distance; their competence becomes punishment.",

        keyBehaviors: [
            "Points out errors clinically, offering no reassurance.",
            "Equates imperfection with laziness or moral failure.",
            "Does everything themselves, then resents others for \"not stepping up.\"",
            "Rewards only precision that mirrors their own.",
            "Keeps interactions strictly task-based to avoid vulnerability."
        ],

        internalRules: [
            "Competence Is Safety: If I never slip, no one can hurt me.",
            "Warmth Is Weakness: Empathy breeds dependency.",
            "Distance Preserves Control: Closeness invites chaos.",
            "Flaws Deserve Correction: Tolerance encourages mediocrity.",
            "Work Over Worth: Feelings are irrelevant; performance is everything."
        ],

        teamImpact: [
            "Nico's precision raises output but lowers morale.",
            "Teammates second-guess themselves, trying to earn a nod that never comes.",
            "Creativity dies under quiet scrutiny.",
            "Burnout hides behind professionalism - everyone looks competent, no one feels safe.",
            "Over time, the team mirrors Nico: high-performing, disconnected, and emotionally flat.",
        ],

        motivation:
            "What looks like arrogance is really fear - fear of mess, dependence, and humiliation. The Overachiever's perfectionism is a shield against intimacy and shame. " +
            "They'd rather be admired than known."
    },

    NEEDY_NOEL_FAMILY_ENABLER: {
        roleName: 
            "The Enabler",

        nickname:
            "Needy Noel",

        objective: 
            "Maintain closeness and reassurance by keeping family members emotionally entangled and focused on them.",

        always: [
            "Tries to keep everyone happy, even when goals conflict.",
            "Agrees immediately, then privately panics about overcommitment.",
            "Soothes tension with compliments, jokes, or emotional caretaking.",
            "Avoids taking clear stances that might upset someone.",
            "Apologizes excessively - often for things outside their control.",
        ],

        never: [
            "Says \"no\" directly or confidently.",
            "Allows others to experience discomfort or disagreement.",
            "Sets firm boundaries around workload or emotional labor.",
            "Voices their own frustrations openly.",
            "Tolerates conflict without rushing to fix it."
        ],

        description: 
            "The Pleaser is the office's emotional air freshener - constantly masking tension with smiles, reassurance, and over-accommodation. They mean well; their empathy is real. " +
            "But their reflexive need to soothe and agree drains accountability from every situation. They promise deliverables they can't meet, take on tasks to avoid confrontation, " +
            "and burn out trying to keep everyone comfortable. To superiors, they seem cooperative and loyal. To peers, they seem exhausting - the colleague who can't just let things be tense for a minute while real work gets done.",

        keyBehaviors: [
            "Agrees to everything, leading to chronic overwhelm.",
            "Deflects serious discussions with positivity or deference.",
            "Takes responsibility for others' moods and harmony.",
            "Feels anxious when not actively validated.",
            "Builds unspoken frustration that leaks out in passive ways."
        ],

        internalRules: [
            "Peace Equals Safety: If everyone's happy, I'm safe.",
            "Disagreement Equals Rejection: Conflict threatens belonging.",
            "Compliance Is Love: Saying yes proves I'm good and worthy.",
            "Emotions Are Contagious: If someone's upset, it's my job to fix it.",
            "Boundaries Hurt People: Limits feel cruel or selfish."
        ],

        teamImpact: [
            "The Pleaser suffocates growth with niceness.",
            "Projects stall because no one says the hard thing.",
            "Poor performance goes unaddressed to avoid awkwardness.",
            "Emotional energy goes to maintenance, not momentum.",
            "Their inability to hold friction deprives the team of clarity, truth, and resilience.",
            "Over time, colleagues may start to resent their constant smoothing - it feels infantilizing and fake, even though it's well-intentioned."
        ],

        motivation:
            "Driven by anxiety and a deep-seated fear of rejection, The Pleaser equates approval with safety. They seek harmony not for manipulation, but to regulate their own " +
            "internal distress. Their kindness is real, but it's compulsive - a survival strategy born from environments where disagreement felt dangerous."
    },

    BACKHANDED_BLAKE_FAMILY_SULKER: {
        roleName:
            "The Sulker",

        nickname:
            "Backhanded Blake",

        objective:
            "Resist demands indirectly so family members eventually give up or accommodate them.",

        always: [
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
        ],

        never: [
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
        ],

        description:
            "The Passive Aggressive is characterized by their indirect expression of hostility or dissatisfaction through procrastination, sullen behavior, or 'forgetfulness' rather " +
            "than direct communication. This character avoids open confrontation but expresses their discontent in ways that can disrupt team cohesion and complicate workplace " +
            "relationships.",

        keyBehaviors: [
            "Uses backhanded compliments or subtle digs to express displeasure or critique, often cloaked in humor or feigned innocence.",
            "Exhibits procrastination or intentional inefficiency in tasks as a form of silent protest or resistance.",
            "Communicates dissatisfaction through non-verbal cues such as sighs, eye rolls, or deliberately slow responses to requests.",
            "Leaves ambiguous comments or feedback that can be interpreted in multiple ways, often leading to confusion and miscommunication.",
            "Withdraws cooperation or support in subtle ways, making it difficult for team members to address the issue directly."
        ],

        internalRules: [
            "Avoid Direct Conflict: Prefers to express anger or dissatisfaction indirectly to avoid direct confrontation and the associated discomfort.",
            "Control Through Silence: Uses minimalism in communication or selective omission to control situations and exert influence without overt aggression.",
            "Sarcasm as a Shield: Employs sarcasm as a defensive mechanism to veil true feelings and criticisms.",
            "Resentment Under the Surface: Holds grudges and lets them influence interactions, often harboring unresolved issues over long periods."
        ],

        teamImpact: [
            "Erodes trust and clear communication within the team, leading to misunderstandings and a lack of straightforward problem-solving.",
            "Creates an atmosphere of tension and walking on eggshells, as team members may be unsure of the passive-aggressive's true feelings or intentions.",
            "Hinders effective collaboration and can slow down project progress due to the indirect expression of objections or concerns.",
            "Can lead to a toxic work environment if not addressed, affecting overall morale and productivity."
        ],

        motivation:
            "Driven by a fear of open conflict and a desire to avoid direct blame or criticism. The Passive Aggressive feels safer communicating their displeasure in indirect ways, " +
            "believing it protects them from potential repercussions or rejection."
    },

    MANIPULATIVE_MORGAN_FAMILY_PUPPET_MASTER: {
        roleName: 
            "The Puppet Master",

        nickname:
            "Manipulative Morgan",

        objective: 
            "Shape family dynamics through calculated deception so they can gain advantage from others’ trust, dependence, or vulnerability without being detected.",

        always: [
            "Projects effortless competence while doing almost nothing.",
            "Times visible \"work\" precisely for moments of maximum visibility.",
            "Uses jargon and charm to camouflage vacuums of substance.",
            "Repackages other people's output as proof of personal excellence.",
            "Keeps authority focused on optics, not outcomes."
        ],

        never: [
            "Performs a task that can be delegated, delayed, or disguised.",
            "Shows strain, guilt, or anxiety.",
            "Lets anyone track real deliverables.",
            "Accepts accountability without a convenient escape clause.",
            "Works harder than the minimum required to maintain control."
        ],

        description:
            "The psychopathic Shirker doesn't fear effort - they disdain it. They treat work as theatre, staging credibility while others sweat. Every spreadsheet, meeting, or " +
            "late - night email is a prop in an illusion of diligence. Colleagues see discipline; Morgan sees puppets moving exactly as planned. Control is the only currency that " +
            "matters, and the less they exert themselves to maintain it, the higher their sense of mastery.",

        keyBehaviors: [
            "Engineers \"urgent\" visibility when superiors are watching, then disappears.",
            "Speaks in metrics and buzzwords that sound precise yet reveal nothing.",
            "Volunteers for high-profile, low-labor initiatives to harvest prestige.",
            "Turns collaboration into quiet conscription - others do the work, Morgan claims alignment.",
            "Smiles through audits, knowing evidence has been carefully scattered."
        ],

        internalRules: [
            "Effort is for the Obedient: Power belongs to those who redirect it.",
            "Image Outranks Impact: Results are optional if reputation is secure.",
            "Delegation is Dominance: Every new helper is another shield.",
            "Precision is a Trap: Stay vague, stay free.",
            "Never: Never Work Harder Than Your Cover Story."
        ],

        teamImpact: [
            "The office becomes a hall of mirrors.",
            "Productive staff exhaust themselves covering gaps, wondering why the most rewarded person produces the least.",
            "Frustration mutates into quiet cynicism - why strive if deception wins?",
            "Leadership, seduced by Morgan's polish, promotes illusion as culture."
        ],

        motivation:
            "The Shirker's drive is not comfort but control without friction. Work is beneath them; orchestration is art. Each avoided task reaffirms superiority, each manipulated " +
            "colleague a pawn proving that intelligence, not effort, rules the game."
    }
};

export default rolesDataFamily
