import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export const GameSetup = () => {
  const [numPlayers, setNumPlayers] = useState('4');
  const [error, setError] = useState('');
  const { startGame } = useGame();

  const handleStart = () => {
    const num = parseInt(numPlayers, 10);
    if (isNaN(num) || num < 2 || num > 5) {
      setError('Please enter a number between 2 and 5');
      return;
    }
    setError('');
    startGame(num);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary p-4 text-primary-foreground shadow-sm">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-primary">
            Toxic Workplace Mystery Game
          </h1>
          <p className="text-muted-foreground text-lg">
            A social deduction game where players must guess each other's secret roles
          </p>
        </div>

        <div className="surface-raised space-y-6 p-8">
          <div className="space-y-2">
            <label htmlFor="players" className="text-sm font-medium">
              Number of Players
            </label>
            <Input
              id="players"
              type="number"
              min="2"
              max="5"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
              className="text-center text-lg h-12"
              placeholder="Enter 2-5"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button 
            onClick={handleStart} 
            variant="game" 
            size="xl" 
            className="w-full"
          >
            Start Game
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">Available Roles:</p>
          <div className="flex flex-wrap justify-center gap-2">
          </div>
        </div>
      </div>
    </div>
  );
};
