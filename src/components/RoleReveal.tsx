import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle, Users, CheckCircle2 } from "lucide-react";
import { Lobby, LobbyPlayer } from "@/types/lobby";
import { useScenarios } from "@/hooks/useScenarios";

interface RoleRevealProps {
    players: LobbyPlayer[];
    myPlayerId: string | null;
    lobby: Lobby;
    onNext: () => void;
    onReady: (isReady: boolean) => void;
}

export const RoleReveal = ({
    players,
    myPlayerId,
    lobby,
    onNext,
    onReady,
}: RoleRevealProps) => {
    const [revealed, setRevealed] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const myPlayer = players.find((p) => p.id === myPlayerId);

    // Load scenarios
    const { scenarios } = useScenarios();

    // ✅ FIXED: safe scenario lookup (no loading gating)
    const scenarioDescription = lobby.scenario_id
        ? scenarios.find((s) => s.id === lobby.scenario_id)?.description
        : undefined;

    // Sync ready state
    useEffect(() => {
        if (myPlayer) {
            const newReadyState = myPlayer.ready_for_roleplay || false;
            setIsReady(newReadyState);
            console.log(
                `[RoleReveal] Player ${myPlayer.id} ready state updated to:`,
                newReadyState
            );
        }
    }, [myPlayer]);

    if (!myPlayer) return null;

    const roleDescriptionText = myPlayer.role_description || "";
    const roleName = myPlayer.nicknames || myPlayer.role || "";
    const personality = myPlayer.role || "";
    const guidelines = myPlayer.guidelines || [];

    const allPlayersReady = players.every((p) => p.ready_for_roleplay);
    const readyCount = players.filter((p) => p.ready_for_roleplay).length;

    console.log(
        `[RoleReveal] Ready status - Count: ${readyCount}/${players.length}, All ready: ${allPlayersReady}`,
        players.map((p) => ({ id: p.id, ready: p.ready_for_roleplay }))
    );

    const handleReadyToggle = () => {
        const newReadyState = !isReady;
        console.log(
            `[RoleReveal] Toggle ready button pressed, new state:`,
            newReadyState
        );
        setIsReady(newReadyState);
        onReady(newReadyState);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl">

                {/* HEADER */}
                <div className="text-center space-y-3 pt-8 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Your Secret Identity
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Read your role carefully and prepare for the roleplay phase
                    </p>
                </div>

                {/* SCENARIO */}
                {scenarioDescription && (
                    <Card className="p-6 mb-8 shadow-md border-secondary/20">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Scenario
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {scenarioDescription}
                        </p>
                    </Card>
                )}

                {/* MAIN CARD */}
                <Card className="p-8 shadow-lg border-secondary/20">
                    <div className="space-y-6">

                        {/* REVEAL BUTTON */}
                        <div className="text-center space-y-3">
                            <Button
                                onClick={() => setRevealed(!revealed)}
                                size="lg"
                                className="w-full h-12 text-base font-semibold"
                                variant={revealed ? "destructive" : "default"}
                            >
                                {revealed ? (
                                    <>
                                        <Eye className="mr-2 h-5 w-5" />
                                        Hide Role
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="mr-2 h-5 w-5" />
                                        Reveal My Role
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* ROLE CONTENT */}
                        {revealed && myPlayer.role && (
                            <div className="animate-in fade-in duration-500 space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* LEFT */}
                                    <div className="space-y-5">

                                        <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/2 text-center space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                🔒 Your Secret Personality
                                            </p>
                                            <p className="text-4xl font-bold text-primary">
                                                {personality}
                                            </p>

                                            {roleName && (
                                                <p className="text-sm pt-2">
                                                    Introduce yourself as{" "}
                                                    <span className="font-bold text-primary">
                                                        {roleName}
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        <Card className="p-5 space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <AlertCircle className="h-5 w-5" />
                                                <p className="font-semibold">Your Personality</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {roleDescriptionText}
                                            </p>
                                        </Card>

                                        <Card className="p-5 space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-5 w-5" />
                                                <p className="font-semibold">Your Objective</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                During guessing phase, identify other players' personalities.
                                                Each correct guess earns points — be strategic!
                                            </p>
                                        </Card>

                                    </div>

                                    {/* RIGHT */}
                                    <div className="space-y-6 flex flex-col">

                                        {guidelines.length > 0 && (
                                            <Card className="p-6">
                                                <p className="font-semibold text-lg mb-4">
                                                    🎭 Roleplay Guidelines
                                                </p>

                                                <ul className="space-y-3">
                                                    {guidelines.map((guideline, index) => (
                                                        <li key={index} className="flex items-start text-sm">
                                                            <span className="mr-3 font-bold text-amber-500">
                                                                {index + 1}.
                                                            </span>
                                                            <span>{guideline}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card>
                                        )}

                                        {/* READY SECTION */}
                                        <div className="border-2 border-blue-200 rounded-lg p-6 space-y-4">

                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">
                                                    Players Ready: {readyCount}/{players.length}
                                                </p>

                                                {allPlayersReady && (
                                                    <div className="flex items-center space-x-2 text-green-600 font-semibold">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        <span>All Ready!</span>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                onClick={handleReadyToggle}
                                                size="lg"
                                                className="w-full h-12"
                                                variant={isReady ? "default" : "outline"}
                                            >
                                                {isReady ? "You're Ready!" : "Mark as Ready"}
                                            </Button>

                                            {allPlayersReady && (
                                                <Button
                                                    onClick={onNext}
                                                    size="lg"
                                                    className="w-full h-12"
                                                    variant="secondary"
                                                >
                                                    Start Roleplay Phase →
                                                </Button>
                                            )}

                                        </div>

                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};