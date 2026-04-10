import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, LogIn, Plus, Settings, BookOpen } from "lucide-react";
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
    if (isNaN(num) || num < 2 || num > 5) {
      setError("Please enter a number between 2 and 5");
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
      <div className="flex h-full min-h-0 flex-col overflow-hidden px-3 pb-2 pt-1 sm:px-5">
        <div className="grid h-full min-h-0 grid-cols-2 content-center gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4 auto-rows-min">
        <div className="surface-raised relative space-y-3 p-4 text-center sm:space-y-4 sm:p-5">
          <Badge className="absolute right-2 top-2 bg-palette-red text-white hover:opacity-90 sm:right-3 sm:top-3">
            Coming Soon
          </Badge>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm sm:p-2.5">
                <Shield className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
              </div>
            </div>
            <h2 className="text-lg font-bold sm:text-xl">Cult Jam</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Cult Identification Game
            </p>
          </div>

          <Button
            onClick={() => handleCultJamClick(true)}
            variant="game"
            size="lg"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleCultJamClick(false)}
            variant="accent"
            size="lg"
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Join Lobby
          </Button>
        </div>

        <div className="surface-raised group relative space-y-3 p-4 text-center sm:space-y-4 sm:p-5">
          <Badge className="absolute right-2 top-2 bg-palette-lime text-palette-black hover:opacity-90 sm:right-3 sm:top-3">
            New
          </Badge>
          <button
            onClick={() => setScenarioEditorOpen(true)}
            className="absolute left-2 top-2 rounded-lg p-2 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100 sm:left-3 sm:top-3"
            title="Edit scenarios and manage assets"
          >
            <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground sm:h-5 sm:w-5" />
          </button>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm sm:p-2.5">
                <Shield className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
              </div>
            </div>
            <h2 className="text-lg font-bold sm:text-xl">Toxic Workplace</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Toxic Workplace Social Deduction Game
            </p>
          </div>

          <Button
            onClick={() => handleToxicWorkplaceCreate()}
            variant="game"
            size="lg"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleToxicWorkplaceJoin()}
            variant="accent"
            size="lg"
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Join Lobby
          </Button>
        </div>

        <div className="surface-raised relative space-y-3 p-4 text-center sm:space-y-4 sm:p-5">
          <Badge className="absolute right-2 top-2 bg-palette-red text-white hover:opacity-90 sm:right-3 sm:top-3">
            Coming Soon
          </Badge>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm sm:p-2.5">
                <Shield className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
              </div>
            </div>
            <h2 className="text-lg font-bold sm:text-xl">Toxic Family</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Toxic Family Identification Game
            </p>
          </div>

          <Button
            onClick={() => handleToxicFamilyClick(true)}
            variant="game"
            size="lg"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Create Lobby
          </Button>

          <Button
            onClick={() => handleToxicFamilyClick(false)}
            variant="accent"
            size="lg"
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Join Lobby
          </Button>
        </div>

        <div className="surface-raised relative space-y-3 p-4 text-center sm:space-y-4 sm:p-5">
          <Badge className="absolute right-2 top-2 bg-palette-blue text-white hover:opacity-90 sm:right-3 sm:top-3">
            Learn
          </Badge>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm sm:p-2.5">
                <BookOpen className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
              </div>
            </div>
            <h2 className="text-lg font-bold sm:text-xl">Improvisation Tutorial</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Learn how to roleplay and improvise effectively
            </p>
          </div>

          <Button
            onClick={() => navigate("/tutorial")}
            variant="game"
            size="lg"
            className="w-full"
          >
            <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Learn Now
          </Button>
        </div>
        </div>

        <ScenarioEditor
          isOpen={scenarioEditorOpen}
          onClose={() => setScenarioEditorOpen(false)}
        />
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Create Lobby</h2>
            <p className="text-muted-foreground">
              Set up a new game for your friends
            </p>
          </div>

          <Card className="surface-raised space-y-6 p-8">
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
                max="5"
                value={numPlayers}
                onChange={(e) => {
                  setNumPlayers(e.target.value);
                  setError("");
                }}
                className="text-center text-lg h-12"
                placeholder="Enter 2-5"
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
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Join Lobby</h2>
          <p className="text-muted-foreground">Enter the lobby code to join</p>
        </div>

        <Card className="surface-raised space-y-6 p-8">
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
    </div>
  );
};

export default LobbyEntry;
