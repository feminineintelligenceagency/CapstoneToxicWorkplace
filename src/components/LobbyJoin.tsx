import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, Users, LogIn } from 'lucide-react';
import { useLobby } from '@/hooks/useLobby';
import { useNavigate } from 'react-router-dom';

export const LobbyJoin = () => {
  const [lobbyCode, setLobbyCode] = useState('');
  const [numPlayers, setNumPlayers] = useState('4');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const { createLobby, joinLobby, loading } = useLobby();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const num = parseInt(numPlayers, 10);
    if (isNaN(num) || num < 2 || num > 50) {
      return;
    }

    const code = await createLobby(num);
    if (code) {
      navigate(`/lobby/${code}`);
    }
  };

  const handleJoin = async () => {
    if (!lobbyCode.trim()) return;
    
    const success = await joinLobby(lobbyCode.toUpperCase(), 'Player');
    if (success) {
      navigate(`/lobby/${lobbyCode.toUpperCase()}`);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full gradient-primary shadow-glow">
                <Shield className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
              Role Reveal
            </h1>
            <p className="text-muted-foreground text-lg">
              Join or create a multiplayer lobby
            </p>
          </div>

          <div className="gradient-card rounded-xl p-8 shadow-card space-y-4">
            <Button 
              onClick={() => setMode('create')} 
              variant="game" 
              size="xl" 
              className="w-full"
            >
              <Users className="mr-2" />
              Create Lobby
            </Button>

            <Button 
              onClick={() => setMode('join')} 
              variant="accent" 
              size="xl" 
              className="w-full"
            >
              <LogIn className="mr-2" />
              Join Lobby
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Create Lobby</h2>
            <p className="text-muted-foreground">Set up a new game</p>
          </div>

          <Card className="gradient-card p-8 shadow-card space-y-6">
            <div className="space-y-2">
              <label htmlFor="players" className="text-sm font-medium">
                Number of Players (2-50)
              </label>
              <Input
                id="players"
                type="number"
                min="2"
                max="50"
                value={numPlayers}
                onChange={(e) => setNumPlayers(e.target.value)}
                className="text-center text-lg h-12"
              />
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCreate} 
                variant="game" 
                size="xl" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Lobby'}
              </Button>

              <Button 
                onClick={() => setMode('menu')} 
                variant="secondary" 
                size="lg" 
                className="w-full"
              >
                Back
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
          <p className="text-muted-foreground">Enter a lobby code</p>
        </div>

        <Card className="gradient-card p-8 shadow-card space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Lobby Code
            </label>
            <Input
              id="code"
              type="text"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              className="text-center text-2xl font-bold h-16 tracking-wider"
              placeholder="ABC123"
              maxLength={6}
            />
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleJoin} 
              variant="accent" 
              size="xl" 
              className="w-full"
              disabled={loading || !lobbyCode.trim()}
            >
              {loading ? 'Joining...' : 'Join Lobby'}
            </Button>

            <Button 
              onClick={() => setMode('menu')} 
              variant="secondary" 
              size="lg" 
              className="w-full"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
