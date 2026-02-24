import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, LogIn, Plus, Settings } from "lucide-react";
import { useLobby } from "@/hooks/useLobby";
import { useToast } from "@/hooks/use-toast";
import { ScenarioEditor } from "@/components/ScenarioEditor";

const lobbyGuessFetch = async () => {
  const url = "https://ai.capstone.ssree.dev/api/player";
  const c = await fetch(url);
  return (await c.json()).body;
};

const LobbyEntry = () => {
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [numPlayers, setNumPlayers] = useState("4");
  const [error, setError] = useState("");
  const [scenarioEditorOpen, setScenarioEditorOpen] = useState(false);
  const navigate = useNavigate();
  const { createLobby, joinLobby, loading } = useLobby();
  const { toast } = useToast();
  const cultJamEnabled = false;
  const toxicFamilyEnabled = false;

  const handleCultJamClick = (isCreate: boolean) => {
    if (!cultJamEnabled) {
      toast({
        title: "Coming Soon",
        description: "Cult Jam is not available yet!",
        variant: "destructive",
      });
      return;
    }

    const state = { slug: "cultJam" };
    history.pushState(state, "");
  };

  const handleToxicFamilyClick = (isCreate: boolean) => {
    if (!toxicFamilyEnabled) {
      toast({
        title: "Coming Soon",
        description: "Toxic Family is not available yet!",
        variant: "destructive",
      });
      return;
    }

    const state = { slug: "toxicFamily" };
    history.pushState(state, "");
  };

  const handleToxicWorkplaceCreate = () => {
    setMode("create");
  };

  const handleToxicWorkplaceJoin = () => {
    setMode("join");
  };

  const handleCreateLobby = async () => {
    const num = parseInt(numPlayers, 10);
    if (isNaN(num) || num < 2 || num > 50) {
      setError("Please enter a number between 2 and 50");
      return;
    }

    const playerNameToUse = playerName.trim() || "Player 1";
    const code = await createLobby(num, playerNameToUse);
    if (code) {
      // Don't call joinLobby again - createLobby already adds the first player
      navigate(`/lobby/${code}`);
    }
  };

  const handleJoinLobby = async () => {
    if (!lobbyCode.trim()) {
      setError("Please enter a lobby code");
      return;
    }

    const playerNameToUse = playerName.trim() || "Player";
    console.log("LobbyEntry - Player name to use:", playerNameToUse); // Debug log
    console.log("LobbyEntry - Raw player name input:", playerName); // Debug log
    const success = await joinLobby(lobbyCode.toUpperCase(), playerNameToUse);
    if (success) {
      navigate(`/lobby/${lobbyCode.toUpperCase()}`);
    }
  };

  if (mode === "menu") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
        {/* CARD 1 */}
        <div className="gradient-card rounded-xl p-8 shadow-card space-y-6 text-center relative">
          <Badge className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
            Coming Soon
          </Badge>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full gradient-primary shadow-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Cult Jam</h2>
            <p className="text-sm text-muted-foreground">
              Cult Identification Game
            </p>
          </div>

          <Button
            onClick={() => handleCultJamClick(true)}
            variant="game"
            size="xl"
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleCultJamClick(false)}
            variant="accent"
            size="xl"
            className="w-full"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Join Lobby
          </Button>
        </div>

        {/* CARD 2 */}
        <div className="gradient-card rounded-xl p-8 shadow-card space-y-6 text-center relative group">
          <Badge className="absolute top-4 right-4 opacity-1">New</Badge>
          <button
            onClick={() => setScenarioEditorOpen(true)}
            className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
            title="Edit scenarios and manage assets"
          >
            <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full gradient-primary shadow-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Toxic Workplace</h2>
            <p className="text-sm text-muted-foreground">
              Toxic Workplace Social Deduction Game
            </p>
          </div>

          <Button
            onClick={() => handleToxicWorkplaceCreate()}
            variant="game"
            size="xl"
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleToxicWorkplaceJoin()}
            variant="accent"
            size="xl"
            className="w-full"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Join Lobby
          </Button>
        </div>

        {/* CARD 3 */}
        <div className="gradient-card rounded-xl p-8 shadow-card space-y-6 text-center relative">
          <Badge className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
            Coming Soon
          </Badge>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full gradient-primary shadow-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Toxic Family</h2>
            <p className="text-sm text-muted-foreground">
              Toxic Family Identification Game
            </p>
          </div>

          <Button
            onClick={() => handleToxicFamilyClick(true)}
            variant="game"
            size="xl"
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleToxicFamilyClick(false)}
            variant="accent"
            size="xl"
            className="w-full"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Join Lobby
          </Button>
        </div>

        <ScenarioEditor isOpen={scenarioEditorOpen} onClose={() => setScenarioEditorOpen(false)} />
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Create Lobby</h2>
            <p className="text-muted-foreground">
              Set up a new game for your friends
            </p>
          </div>

          <Card className="gradient-card p-8 shadow-card space-y-6">
            <div className="space-y-2">
              <label htmlFor="playerName" className="text-sm font-medium">
                Your Name (Optional)
              </label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="numPlayers" className="text-sm font-medium">
                Number of Players
              </label>
              <Input
                id="numPlayers"
                type="number"
                min="2"
                max="50"
                value={numPlayers}
                onChange={(e) => {
                  setNumPlayers(e.target.value);
                  setError("");
                }}
                className="text-center text-lg h-12"
                placeholder="Enter 2-50"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setMode("menu")}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateLobby}
                variant="game"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                Create
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Join Lobby</h2>
          <p className="text-muted-foreground">Enter the lobby code to join</p>
        </div>

        <Card className="gradient-card p-8 shadow-card space-y-6">
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Your Name (Optional)
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lobbyCode" className="text-sm font-medium">
              Lobby Code
            </label>
            <Input
              id="lobbyCode"
              value={lobbyCode}
              onChange={(e) => {
                setLobbyCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="XXXXXX"
              className="text-center text-2xl h-14 tracking-widest uppercase font-bold"
              maxLength={6}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setMode("menu")}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleJoinLobby}
              variant="accent"
              size="lg"
              className="flex-1"
              disabled={loading}
            >
              Join
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LobbyEntry;
