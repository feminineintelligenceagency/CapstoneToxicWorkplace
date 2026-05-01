import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LobbyPlayer } from '@/types/lobby';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsProps {
  players: LobbyPlayer[];
  onReset: () => void;
}

export const Results = ({ players, onReset }: ResultsProps) => {
  const getOverallScore = (p: LobbyPlayer) => p.overall_score ?? p.score;

  const maxScore = Math.max(...players.map((p) => getOverallScore(p)));
  const winners = players.filter((p) => getOverallScore(p) === maxScore);

  return (
  <div className="min-h-screen flex items-start justify-center p-4 pt-24">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full gradient-accent shadow-glow">
              <Trophy className="w-12 h-12 text-accent-foreground" />
            </div>
          </div>
          <h2 className="text-4xl font-bold">Game Results</h2>
          {maxScore === 0 ? (
            <p className="text-xl text-muted-foreground">
              No points earned. Better luck next time!
            </p>
          ) : winners.length === 1 ? (
            <p className="text-xl gradient-text-accent font-bold">
              🎉 Winner: {winners[0].player_name} with {maxScore} points!
            </p>
          ) : (
            <p className="text-xl gradient-text-accent font-bold">
              🎉 Tie between: {winners.map((w) => w.player_name).join(', ')} (each {maxScore} points)
            </p>
          )}
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            {players
              .sort((a, b) => getOverallScore(b) - getOverallScore(a))
              .map((player) => (
                <Card key={player.id} className="gradient-card p-6 shadow-card">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{player.player_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Actual Role: <span className="text-primary font-semibold">{player.role}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold gradient-text-accent">
                          {getOverallScore(player)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getOverallScore(player) === 1 ? 'point' : 'points'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <div>Guess: {player.guess_score} • Role: {player.role_score}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">LLM roleplay summary:</p>
                      <p className="text-sm text-primary">
                        {player.roleplaySummary?.trim() || 'No LLM summary generated yet. This player will get a concise summary after grading.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">Guesses:</p>
                      <div className="grid gap-2">
                        {players
                          .filter((p) => p.id !== player.id)
                          .map((target) => {
                            const guess = player.guesses[target.id];
                            const correct = guess === target.role;
                            return (
                              <div
                                key={target.id}
                                className={`flex items-center justify-between p-2 rounded-lg ${
                                  correct ? 'bg-green-500/10' : 'bg-destructive/10'
                                }`}
                              >
                                <span className="text-sm">
                                  {target.player_name}:{' '}
                                  <span className="font-semibold">{guess || 'No guess'}</span>
                                </span>
                                {guess &&
                                  (correct ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  ))}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </ScrollArea>

        <div className="flex justify-center">
          <Button onClick={onReset} variant="game" size="xl">
            Back to Lobby
          </Button>
        </div>
      </div>
    </div>
  );
};
