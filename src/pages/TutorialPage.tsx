import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function TutorialPage() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    gettingStarted: true,
    improvisation: false,
    roleplay: false,
    tips: false,
    common: false,
  });

  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-pink-500/10 hover:from-blue-500/20 hover:to-pink-500/20 rounded-lg transition-all"
    >
      <h3 className="text-xl font-semibold text-left">{title}</h3>
      <ChevronDown
        className="w-5 h-5 transition-transform"
        style={{
          transform: expandedSections[section]
            ? "rotate(180deg)"
            : "rotate(0deg)",
        }}
      />
    </button>
  );

  const SectionContent = ({ children }: { children: React.ReactNode }) => (
    <div className="pl-4 pr-4 pb-4 text-muted-foreground space-y-4 text-lg leading-relaxed">
      {children}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        lineHeight: "1.6",
        textAlign: "left",
        marginTop: "20px",
        paddingBottom: "40px",
      }}
    >
      <h1
        style={{
          padding: "50px 50px 30px 50px",
          textAlign: "center",
        }}
        className="text-5xl font-bold gradient-text-primary"
      >
        Improvisation & Roleplay Tutorial
      </h1>

      <p
        style={{
          padding: "0 50px 40px 50px",
          textAlign: "center",
        }}
        className="text-xl text-muted-foreground"
      >
        Learn how to improvise and roleplay effectively to become a master of
        the game!
      </p>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px",
          marginBottom: "40px",
        }}
        className="space-y-6"
      >
        {/* GETTING STARTED SECTION */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50">
          <SectionHeader
            title="🎬 Getting Started with Roleplay"
            section="gettingStarted"
          />
          {expandedSections.gettingStarted && (
            <SectionContent>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What is Roleplay?
                </h4>
                <p>
                  Roleplay is the act of assuming and playing the role of a
                  fictional character. In Toxic Workplace Simulator, you'll be
                  assigned a specific role with unique characteristics,
                  behaviors, and objectives. Your goal is to embody this
                  character naturally while interacting with other players.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Understanding Your Role
                </h4>
                <p>
                  When you join a game, you'll receive a detailed description of
                  your role including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Role Name:</strong> Your official title (e.g.,
                    Micromanager)
                  </li>
                  <li>
                    <strong>Personality Type:</strong> Your behavioral archetype
                  </li>
                  <li>
                    <strong>Key Behaviors:</strong> Actions you should
                    frequently display
                  </li>
                  <li>
                    <strong>Objective:</strong> What you're trying to achieve in
                    the scenario
                  </li>
                  <li>
                    <strong>Constraints:</strong> Things you should always or
                    never do
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  The Basic Goal
                </h4>
                <p>
                  Play your role authentically for the entire roleplay period
                  (typically 5 minutes). After the roleplay ends, other players
                  will try to guess your role based on your behavior and
                  interactions. The better you embody your character, the harder
                  you'll be to identify!
                </p>
              </div>
            </SectionContent>
          )}
        </div>

        {/* IMPROVISATION SECTION */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50">
          <SectionHeader
            title="✨ Mastering Improvisation"
            section="improvisation"
          />
          {expandedSections.improvisation && (
            <SectionContent>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What is Improvisation?
                </h4>
                <p>
                  Improvisation is creating dialogue and actions spontaneously
                  without a script. In Toxic Workplace, you won't have
                  predetermined lines—you'll react naturally to the scenario and
                  other players' behavior.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Improvisation Principles
                </h4>

                <div className="space-y-4 ml-2">
                  <div>
                    <strong className="text-foreground">
                      1. Say "Yes, And..."
                    </strong>
                    <p className="mt-1">
                      Accept what other players introduce and build on it. If
                      someone says the project deadline is tomorrow, don't
                      contradict them—build on that reality. This keeps the
                      scene flowing naturally.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      2. Listen Actively
                    </strong>
                    <p className="mt-1">
                      Pay close attention to what other players are saying and
                      doing. Respond to their actions and comments specifically.
                      This creates believable interactions and prevents awkward
                      silence.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      3. Stay in Character
                    </strong>
                    <p className="mt-1">
                      Once you've established your character's personality,
                      maintain consistency. If your character is anxious, don't
                      suddenly act confident. If they're outgoing, stay engaged
                      throughout.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      4. Show, Don't Tell
                    </strong>
                    <p className="mt-1">
                      Demonstrate your role through behavior and actions rather
                      than announcing it. Instead of saying "I'm a
                      micromanager," show it by asking detailed questions about
                      work progress and offering unsolicited feedback.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      5. Embrace the Awkward
                    </strong>
                    <p className="mt-1">
                      Not every interaction will be smooth, and that's okay!
                      Awkwardness is part of roleplay. Use uncomfortable moments
                      to develop your character further.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      6. Don't Overact
                    </strong>
                    <p className="mt-1">
                      You don't need exaggerated gestures or voices (though you
                      can use them!). Subtle behavior changes can be just as
                      effective. A skeptical glance or hesitation can say more
                      than loud declarations.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Dealing with Mistakes
                </h4>
                <p>
                  If you slip out of character or say something that doesn't fit
                  your role, just move on. You don't need to explain or
                  apologize in-game. The game is about flow and fun, not
                  perfection. Simply redirect back to your character's
                  perspective and continue.
                </p>
              </div>
            </SectionContent>
          )}
        </div>

        {/* ROLEPLAY TECHNIQUES SECTION */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50">
          <SectionHeader title="🎭 Roleplay Techniques" section="roleplay" />
          {expandedSections.roleplay && (
            <SectionContent>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Building Your Character
                </h4>

                <div className="space-y-3 ml-2">
                  <div>
                    <strong className="text-foreground">
                      Understand Motivations:
                    </strong>
                    <p className="mt-1">
                      Why does your character behave the way they do? What are
                      they trying to achieve? Understanding the "why" behind
                      actions makes your roleplay more authentic and deeper.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      Create Physical Tells:
                    </strong>
                    <p className="mt-1">
                      How does your character sit? Do they fidget? Make eye
                      contact or avoid it? Small physical behaviors help others
                      identify your personality type and make your roleplay more
                      three-dimensional.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      Develop a Voice/Speech Pattern:
                    </strong>
                    <p className="mt-1">
                      Does your character speak quickly or slowly? Use formal or
                      casual language? Interrupt others or wait their turn?
                      Speech patterns are a powerful tool for character
                      differentiation.
                    </p>
                  </div>

                  <div>
                    <strong className="text-foreground">
                      React Emotionally:
                    </strong>
                    <p className="mt-1">
                      Show emotions appropriate to your character. An anxious
                      person might show concern; a confident person might show
                      dismissal. Your emotional responses should align with your
                      character's personality.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Creating Conflict & Tension
                </h4>
                <p>
                  Don't be afraid to create interpersonal friction. Many roles
                  naturally create tension with others. Lean into disagreements,
                  debates, and conflicting perspectives. This makes the roleplay
                  more interesting and gives players more material to work with.
                  However, keep it professional—focus on workplace conflict, not
                  personal attacks.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Adapting to Your Scenario
                </h4>
                <p>
                  Each scenario has a specific setting and context (e.g., a team
                  meeting about layoffs). Use this context to ground your
                  character. Reference the scenario details, respond to the
                  situation at hand, and let the circumstances inform your
                  character's reactions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Balancing Screen Time
                </h4>
                <p>
                  While you want to be memorable, don't dominate the
                  conversation. Give others space to roleplay and respond.
                  Strong characters interact meaningfully with others rather
                  than performing monologues. This creates a better experience
                  for everyone.
                </p>
              </div>
            </SectionContent>
          )}
        </div>

        {/* PRACTICAL TIPS SECTION */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50">
          <SectionHeader title="💡 Practical Tips for Success" section="tips" />
          {expandedSections.tips && (
            <SectionContent>
              <ul className="space-y-3 list-disc list-inside ml-2">
                <li>
                  <strong>Warm Up:</strong> Before the game starts, review your
                  role and think about how you'll embody it. Mental preparation
                  helps you jump in smoothly.
                </li>

                <li>
                  <strong>Use Your Environment:</strong> Reference details from
                  the scenario. Mention files, deadlines, team members, or
                  projects that fit the context.
                </li>

                <li>
                  <strong>Ask Questions:</strong> Most roles benefit from asking
                  other players about their work, progress, or thoughts.
                  Questions keep conversations active and natural.
                </li>

                <li>
                  <strong>React to What Others Say:</strong> Don't prepare
                  entire speeches. Instead, respond genuinely to what other
                  players introduce into the scene.
                </li>

                <li>
                  <strong>Be Memorable:</strong> Pick 1-2 distinctive behaviors
                  or catchphrases that define your character. This makes you
                  easier to remember but not caricatured.
                </li>

                <li>
                  <strong>Manage Your Energy:</strong> Stay engaged throughout
                  the entire roleplay period. Even during quiet moments, your
                  character should be present and listening.
                </li>

                <li>
                  <strong>Respect Your Role's Constraints:</strong> If your role
                  says "never admit mistakes" or "always be helpful," honor
                  those constraints. They're designed to make your character
                  distinctive.
                </li>

                <li>
                  <strong>Use Body Language:</strong> Lean in, sit back, cross
                  your arms, nod, or shake your head. Non-verbal communication
                  is powerful even in text-based or limited-interaction
                  settings.
                </li>

                <li>
                  <strong>Don't Break Character:</strong> If you feel like
                  you're making mistakes or the scene is awkward, stay in
                  character anyway. Breaking the fourth wall ruins the illusion
                  for everyone.
                </li>

                <li>
                  <strong>Have Fun:</strong> Remember, this is a game designed
                  to be enjoyable. Don't stress about perfect performance. The
                  best roleplay comes from relaxation and genuine engagement.
                </li>
              </ul>
            </SectionContent>
          )}
        </div>

        {/* COMMON MISTAKES SECTION */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white/50">
          <SectionHeader title="⚠️ Common Mistakes to Avoid" section="common" />
          {expandedSections.common && (
            <SectionContent>
              <div className="space-y-4 ml-2">
                <div>
                  <strong className="text-foreground text-red-600">
                    Overexplaining Your Role
                  </strong>
                  <p className="mt-1">
                    Don't literally describe your character. Show it through
                    behavior. Saying "I'm a micromanager" gives away your
                    identity instantly.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Being Too Subtle
                  </strong>
                  <p className="mt-1">
                    While you don't want to be obvious, you also want other
                    players to notice your character's distinctive traits. Find
                    a balance between memorable and not heavyhanded.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Not Engaging with Others
                  </strong>
                  <p className="mt-1">
                    Roleplay isn't a solo performance. Actively involve other
                    players. Ask them questions, respond to their ideas, and
                    create interactions.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Ignoring the Scenario
                  </strong>
                  <p className="mt-1">
                    The scenario context is crucial. If you're in a meeting
                    about project deadlines, don't pretend it's a casual chat.
                    Use the scenario to ground your character.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Contradicting Established Facts
                  </strong>
                  <p className="mt-1">
                    Once something is established in the scene (a deadline, a
                    decision, a problem), work with it. Contradicting creates
                    confusion rather than interesting conflict.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Getting Defensive
                  </strong>
                  <p className="mt-1">
                    If someone challenges your character's position, embrace it
                    as conflict, not criticism. Your character might defend
                    their position, but you shouldn't get defensive about your
                    roleplay.
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Abandoning Character Under Pressure
                  </strong>
                  <p className="mt-1">
                    If the roleplay gets intense or uncomfortable, that's often
                    when it's most interesting! Stay in character and lean into
                    the drama (while respecting others' boundaries).
                  </p>
                </div>

                <div>
                  <strong className="text-foreground text-red-600">
                    Forgetting About Listening
                  </strong>
                  <p className="mt-1">
                    Great roleplay is a 50/50 split between performing and
                    reacting. Listen to what others are saying and build on it
                    rather than just waiting for your turn to speak.
                  </p>
                </div>
              </div>
            </SectionContent>
          )}
        </div>

        {/* CLOSING */}
        <div className="gradient-card rounded-lg p-6 shadow-card text-center space-y-4">
          <h3 className="text-2xl font-semibold">Ready to Play?</h3>
          <p className="text-muted-foreground">
            Remember: The best roleplay comes from having fun and engaging
            authentically with your character and fellow players. Trust your
            instincts, listen actively, and enjoy the experience!
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="game"
            size="lg"
            className="mt-4"
          >
            Back to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
