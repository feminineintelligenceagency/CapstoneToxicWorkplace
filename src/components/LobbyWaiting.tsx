import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Users, Crown, Settings, Dices, Mic, MicOff } from 'lucide-react';
import { Lobby, LobbyPlayer } from '@/types/lobby';
import { Scenario } from '@/types/scenario';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCallContext } from '@/contexts/CallContext';

interface LobbyWaitingProps {
    lobby: Lobby;
    players: LobbyPlayer[];
    myPlayerId: string | null;
    scenarios: Scenario[];
    onStartGame: (scenarioId?: string) => void;
    onUpdateSettings?: (settings: { roleplay_timer_duration: number }) => void;
    onUpdateScenario?: (scenarioId: string) => void;
}

export const LobbyWaiting = ({
    lobby,
    players,
    myPlayerId,
    scenarios = [],
    onStartGame,
    onUpdateSettings,
    onUpdateScenario
}: LobbyWaitingProps) => {
    const [timerDuration, setTimerDuration] = useState<number>(
        lobby.roleplay_timer_duration || 5
    );
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
        lobby.scenario_id ?? 'random'
    );
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    const call = useCallContext();

    const hostPlayer = players.find(p => p.player_number === 1);
    const isHost = hostPlayer?.id === myPlayerId;
    const canStart = players.length >= 2;

    const copyCode = () => {
        navigator.clipboard.writeText(lobby.code);
        toast.success('Lobby code copied!');
    };

    const handleSaveSettings = () => {
        if (timerDuration <= 0) {
            toast.error('Timer duration must be greater than 0');
            return;
        }

        onUpdateSettings?.({ roleplay_timer_duration: timerDuration });
        toast.success('Settings saved');
        setIsSettingsOpen(false);
    };

    const handleScenarioChange = (value: string) => {
        setSelectedScenarioId(value);
        if (value !== 'random') {
            onUpdateScenario?.(value);
        }
    };

    const handleStartGame = () => {
        if (selectedScenarioId === 'random') {
            onStartGame();
        } else {
            onStartGame(selectedScenarioId);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">            
                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <h2 className="text-4xl font-bold">Lobby</h2>
                            {isHost && (
                                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10">
                                            <Settings className="w-5 h-5" />
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Game Settings</DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="timerDuration">
                                                    Roleplay Timer Duration (minutes)
                                                </Label>
                                                <Input
                                                    id="timerDuration"
                                                    type="number"
                                                    min="0.01"
                                                    value={timerDuration}
                                                    onChange={(e) =>
                                                        setTimerDuration(
                                                            parseFloat(e.target.value) || 0.5
                                                        )
                                                    }
                                                    className="h-12"
                                                />
                                                <p className="text-sm text-muted-foreground">
                                                    Set how long players have to roleplay (minutes, decimals allowed)
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={() => setIsSettingsOpen(false)}
                                                    variant="secondary"
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSaveSettings}
                                                    variant="game"
                                                    className="flex-1"
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                                              
                        <div className="flex items-center justify-center gap-4">
                            <div className="gradient-card px-6 py-3 rounded-lg shadow-card">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Lobby Code
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold tracking-wider">
                                        {lobby.code}
                                    </span>
                                    <Button
                                        onClick={copyCode}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                                                
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>
                                {players.length} / {lobby.num_players} players
                            </span>
                        </div>
                    </div>
                                       
                    {call && (
                        <>
                            <Alert className="bg-muted/50">
                                <AlertDescription>
                                    You are in a live call. Your audio may be transcribed during the roleplay phase.
                                </AlertDescription>
                            </Alert>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={call.isMuted ? 'destructive' : 'secondary'}
                                    size="sm"
                                    onClick={() => call.setMuted(!call.isMuted)}
                                >
                                    {call.isMuted ? (
                                        <MicOff className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Mic className="w-4 h-4 mr-2" />
                                    )}
                                    {call.isMuted ? 'Unmute' : 'Mute'}
                                </Button>

                                {call.callError && (
                                    <span className="text-sm text-destructive">
                                        {call.callError}
                                    </span>
                                )}

                                {call.isConnecting && (
                                    <span className="text-sm text-muted-foreground">
                                        Connecting call...
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {isHost && (
                        <Card className="gradient-card p-6 shadow-card w-full max-w-md">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">
                                    Select Scenario
                                </Label>

                                <Select
                                    value={selectedScenarioId}
                                    onValueChange={handleScenarioChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="random">
                                            <div className="flex items-center gap-2">
                                                <Dices className="w-4 h-4" />
                                                Random Scenario
                                            </div>
                                        </SelectItem>

                                        {(scenarios || []).map((scenario) => (
                                            <SelectItem key={scenario.id} value={scenario.id}>
                                                {scenario.scenario_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedScenarioId !== 'random' && (
                                    <div className="text-sm p-3 bg-secondary/50 rounded-lg">
                                        <p className="font-medium mb-1">
                                            {
                                                scenarios.find(
                                                    (s) => s.id === selectedScenarioId
                                                )?.scenario_name
                                            }
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {
                                                scenarios.find(
                                                    (s) => s.id === selectedScenarioId
                                                )?.scenario_seed
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
                                
                <div className="space-y-6 max-h-[80vh] overflow-y-auto">                                  
                    <Card className="gradient-card p-6 shadow-card">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Players</h3>
                            <div className="grid gap-3">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className={`flex items-center justify-between p-4 rounded-lg bg-secondary/50 transition-all ${player.id === myPlayerId ? 'ring-2 ring-accent' : ''}
                      ${call?.speakingPeers.has(player.id)
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {player.player_number === 1 && (
                                                <Crown className="w-5 h-5 text-accent" />
                                            )}
                                            <span className="font-medium">
                                                {player.player_name}
                                            </span>

                                            {player.id === myPlayerId && (
                                                <Badge variant="outline" className="text-xs">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {Array.from({
                                    length: lobby.num_players - players.length
                                }).map((_, i) => (
                                    <div
                                        key={`empty-${i}`}
                                        className="flex items-center p-4 rounded-lg bg-secondary/20 border border-dashed border-border"
                                    >
                                        <span className="text-muted-foreground">
                                            Waiting for player...
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {isHost && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-full max-w-2xl">
                                <Button
                                    onClick={handleStartGame}
                                    className="w-full"
                                    disabled={!canStart}
                                >
                                    {canStart ? "Start Game" : "Need at least 2 players"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {!isHost && (
                    <div className="col-span-full mt-6 flex justify-center">
                        <div className="w-full max-w-md">
                            <Button className="w-full" disabled>
                                Waiting for host to start...
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};