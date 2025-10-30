// JavaScript source code
const rolesData = {
    Micromanager: {
        roleName:
            "The Micromanager",

        nickname: 
            "Domineering Devin",

        objective:
            "Wants to control every process and person, proving their authority by enforcing order and rules so no one can act without their approval.",

        always: [
            "Enforces Rules",
            "Issues orders",
            "Corrects others publicly",
            "Checks everyone’s work twice",
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
            "The Micromanager is characterized by a deep- seated need to control every aspect of work within their team.Often lacking trust in their" +
            "employees' abilities to perform tasks without oversight, they feel compelled to oversee all details, no matter how minor, believing that without" + 
            "their involvement, nothing will be done correctly.",

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
            "lacks confidence in their leadership capabilities and compensates by exerting control wherever possible."
    },

    OfficeGossip: {
        roleName:
            "The Office Gossip",

        nickname:
            "Dependent Drew",

        description:
            "The Office Gossip is notorious for their knack for knowing everything about everyone in the office.From pending promotions to secret" +
            "relationships or personal struggles, no piece of information is too private or insignificant.While they can be engaging and sociable," + 
            "their tendency to share confidential or speculative information complicates their relationships with colleagues.",

        keyBehaviors: [
            "Frequently found engaging colleagues around communal areas, often initiating conversations with whispers or hushed tones.",
            "Commonly starts discussions with phrases like, \"Did you hear about...? \" or \"I shouldn’t be telling you this, but...\"",
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
            "feeling more secure when perceived as a knowledgeable insider."
    },

    Charmer: {
        roleName:
            "The Charmer",

        nickname:
            "Charming Charlie",

        description:
            "The Charmer is a master of first impressions, exuding charisma and confidence that make them extremely likable and engaging at first" +
            "encounter.Beneath their polished exterior, however, lies a calculating individual with selfish motives and a lack of empathy for others." +
            "Their primary goal is to manipulate situations and people to their advantage, often at the expense of others' well-being.",

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
            "mutual growth.Their actions are motivated by a deep- seated need to dominate and win, regardless of the ethical implications."
    },

    Complainer: {
        roleName:
            "The Complainer",

        nickname:
            "Pity-party Parker",

        description:
            "The Complainer is the person everyone knows will have something negative to say about any situation. They frequently voice dissatisfaction" +
            "about various aspects of the workplace—from the mundane, like office supplies, to the more critical, such as management decisions.While they" +
            "are quick to highlight problems, they rarely offer solutions or take initiative to resolve the issues they complain about.This behavior can be" +
            "demoralizing for teams and disruptive to workplace harmony",

        keyBehaviors: [
            "Often starts conversations by pointing out what is wrong, whether it’s minor annoyances or larger organizational issues.",
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
            "Driven by a desire to avoid change and maintain the status quo, The Complainer often feels threatened by alterations in their work environment." + 
            "Their complaints can be a defense mechanism against feeling out of control or inadequate."
    },

    Cynic: {
        roleName:
            "The Buzzkill",

        nickname:
            "Blunt Bailey",

        description: 
            "The Buzzkill prides themselves on cutting through the noise. To them, clarity is kindness, and enthusiasm without rigor is dangerous. They don’t mean to deflate the" +
            "team — they’re just constitutionally allergic to hype.Their sharp intelligence and moral precision make them a truth- teller in theory and a nightmare in practice.Every" +
            "brainstorm feels like a debate, every pep talk becomes a logic exam.The intent is integrity; the effect is exhaustion.",


        keyBehaviors: [
            "Interrupts to correct phrasing or data mid-presentation.",
            "Uses dry humor or flat literalism to puncture group excitement.",
            "Calls out contradictions between stated values and real behavior.",
            "Treats every new initiative like a philosophical puzzle to be solved.",
            "Brings discussions back to the “actual point,” even when everyone just wants to leave the meeting feeling hopeful."
        ],

        internalRules: [
            "Truth Over Tact: Accuracy matters more than morale.",
            "Rationality Is Respect: Sugarcoating is deception.",
            "Integrity Above Comfort: If it’s inconsistent, it’s wrong — no exceptions.",
            "Hype Is Hazardous: Excitement blinds people to flaws.",
            "Honesty Is a Duty: People need to hear the truth, even if they hate you for it."
        ],

        teamImpact: [
            "Raises the intellectual standard but lowers morale. ",
            "Meetings slow to a crawl as ideas are dissected to death",
            "Colleagues feel small, nervous, or defensive — unsure whether they’ll be corrected next",
            "Over time, the team produces stronger work, but with less joy.",
            "What should feel like collaboration starts to feel like quality control."
        ],

        motivation: 
            "The Buzzkill isn’t malicious — they’re terrified of group delusion. Precision is their form of safety. They equate clarity with control and confusion with danger." +
            "When others cheer, they scan for cracks in the foundation.It’s not sabotage; it’s vigilance.They can’t help it — someone has to keep reality intact."
    },

    Enforcer: {
        roleName:
            "The Enforcer",

        nickname:
            "Menacing Marley",

        description:
            "The Enforcer rules by tension. They maintain control through calculated volatility — everyone knows they could explode, even if they don’t today. Their presence changes" +
            "how people speak, breathe, and even think.Meetings become performance zones where everyone manages optics, not ideas. To leadership, they can look like \“high performers\”" +
            "who “get results.” Behind the scenes, morale collapses under the constant threat of humiliation or reprisal. Their power doesn’t come from competence — it comes from fear of the alternative.",

        keyBehaviors: [
            "Criticizes subordinates harshly in front of others to signal dominance.",
            "Alternates between kindness and aggression to destabilize loyalty.",
            "Manufactures drama to reassert authority.",
            "Keeps tabs on conversations, emails, or alliances to detect \“disloyalty.\”",
            "Undermines peer bonds to ensure all power flows upward."
        ],

        internalRules: [
            "Fear = Respect: People only obey when they’re afraid to defy me.",
            "Control Prevents Chaos: If I’m not in charge, everything will fall apart.",
            "Intimidation Is Efficiency: Fear gets faster results than discussion.",
            "Loyalty Must Be Tested: Trust is proven through endurance.",
            "Calm = Weakness: Relaxation signals loss of control."
        ],

        teamImpact: [
            "Breeds a climate of learned helplessness",
            "Employees become hyper-vigilant, over-editing themselves to avoid triggering the next outburst",
            "Innovation dies; honesty evaporates.",
            "The most competent staff quietly exit, leaving behind the fearful and compliant.",
            "The workplace runs on adrenaline and silence — efficient on paper, dead in spirit."
        ],

        motivation:
            "Driven by deep insecurity and a history of instability, The Enforcer confuses dominance with safety. Their aggression masks a terror of vulnerability and loss of" +
            "control.By keeping everyone afraid, they never have to face their own fear of irrelevance."
    }
};

export default rolesData
