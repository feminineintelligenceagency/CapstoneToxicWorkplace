-- Add roleplay_timer_end field to lobbies table
ALTER TABLE public.lobbies
ADD COLUMN IF NOT EXISTS roleplay_timer_end TIMESTAMP WITH TIME ZONE;

