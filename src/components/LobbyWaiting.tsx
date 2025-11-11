import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Users, Crown, Settings } from 'lucide-react';
import { Lobby, LobbyPlayer } from '@/types/lobby';
import { toast } from 'sonner';
import { useState } from 'react';

interface LobbyWaitingProps {
  lobby: Lobby;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  onStartGame: () => void;
  onUpdateSettings?: (settings: {roleplay_timer_duration: number}) => void;
}

export const LobbyWaiting = ({ lobby, players, myPlayerId, onStartGame, onUpdateSettings }: LobbyWaitingProps) => {
  const [timerDuration, setTimerDuration] = useState<number>(lobby.roleplay_timer_duration || 5);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  // Find the host by looking for player_number: 1, not by array position
  const hostPlayer = players.find(p => p.player_number === 1);
  const isHost = hostPlayer?.id === myPlayerId;
  const canStart = players.length >= 2;

  const copyCode = () => {
    navigator.clipboard.writeText(lobby.code);
    toast.success('Lobby code copied!');
  };

  const handleSaveSettings = () => {
    if (timerDuration < 1 || timerDuration > 60) {
      toast.error('Timer duration must be between 1 and 60 minutes');
      return;
    }

    if (onUpdateSettings) {
      onUpdateSettings({ roleplay_timer_duration: timerDuration });
      toast.success("Settings saved");
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-4xl font-bold">Lobby</h2>
            {isHost && (
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                  >
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
                        min="1"
                        max="60"
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(parseInt(e.target.value) || 5)}
                        className="h-12"
                      />
                      <p className="text-sm text-muted-foreground">
                        Set how long players have to roleplay (1-60 minutes)
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
              <p className="text-sm text-muted-foreground mb-1">Lobby Code</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-wider">{lobby.code}</span>
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

        {/* Rest of the component remains the same... */}
        <Card className="gradient-card p-6 shadow-card">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Players</h3>
            <div className="grid gap-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg bg-secondary/50 ${
                    player.id === myPlayerId ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {player.player_number === 1 && <Crown className="w-5 h-5 text-accent" />}
                    <span className="font-medium">{player.player_name}</span>
                    {player.id === myPlayerId && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {Array.from({ length: lobby.num_players - players.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center p-4 rounded-lg bg-secondary/20 border border-dashed border-border"
                >
                  <span className="text-muted-foreground">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {isHost && (
          <div className="space-y-2">
            <Button
              onClick={onStartGame}
              variant="game"
              size="xl"
              className="w-full"
              disabled={!canStart}
            >
              {canStart ? 'Start Game' : `Need at least 2 players`}
            </Button>
            {!canStart && (
              <p className="text-center text-sm text-muted-foreground">
                Share the lobby code with friends to start playing
              </p>
            )}
          </div>
        )}

        {!isHost && (
          <div className="text-center text-muted-foreground">
            <p>Waiting for host to start the game...</p>
          </div>
        )}
      </div>
    </div>
  );
};