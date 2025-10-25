-- Create lobbies table
CREATE TABLE public.lobbies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  num_players INTEGER NOT NULL,
  current_phase TEXT NOT NULL DEFAULT 'setup',
  current_player_index INTEGER DEFAULT 0,
  current_guess_target INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'in_progress', 'completed'))
);

-- Create lobby_players table
CREATE TABLE public.lobby_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id UUID NOT NULL REFERENCES public.lobbies(id) ON DELETE CASCADE,
  player_number INTEGER NOT NULL,
  player_name TEXT NOT NULL DEFAULT 'Player',
  role TEXT,
  guesses JSONB DEFAULT '{}'::jsonb,
  score INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lobby_id, player_number)
);

-- Enable Row Level Security
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_players ENABLE ROW LEVEL SECURITY;

-- Lobbies policies (public access for multiplayer game)
CREATE POLICY "Anyone can view lobbies"
ON public.lobbies
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create lobbies"
ON public.lobbies
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update lobbies"
ON public.lobbies
FOR UPDATE
USING (true);

-- Lobby players policies
CREATE POLICY "Anyone can view lobby players"
ON public.lobby_players
FOR SELECT
USING (true);

CREATE POLICY "Anyone can join lobbies"
ON public.lobby_players
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their player data"
ON public.lobby_players
FOR UPDATE
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobbies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_players;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lobbies_updated_at
BEFORE UPDATE ON public.lobbies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique lobby codes
CREATE OR REPLACE FUNCTION public.generate_lobby_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;