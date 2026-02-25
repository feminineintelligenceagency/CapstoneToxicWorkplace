import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lobby, LobbyPlayer } from "@/types/lobby";
import { toast } from "sonner";

export const useLobby = (lobbyCode?: string) => {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      return localStorage.getItem("myPlayerId");
    }
    return null;
  });

  useEffect(() => {
    if (!lobbyCode) return;

    let currentLobbyId: string | null = null;

    const fetchLobby = async () => {
      const { data: lobbyData } = await supabase
        .from("lobbies")
        .select("*")
        .eq("code", lobbyCode)
        .single();

      if (lobbyData) {
        currentLobbyId = lobbyData.id;
        setLobby(lobbyData as Lobby);

        const { data: playersData } = await supabase
          .from("lobby_players")
          .select("*")
          .eq("lobby_id", lobbyData.id)
          .order("player_number", { ascending: true });

        if (playersData) {
          console.log("Fetched players:", playersData); // Debug log
          console.log("Current myPlayerId:", myPlayerId); // Debug log
          // Map players data - role_description, nicknames, guidelines, and ranked_choices should now be in database
          const mappedPlayers: LobbyPlayer[] = playersData.map((p: any) => ({
            ...p,
            role_description: p.role_description ?? "",
            nicknames: p.nicknames ?? "",
            guidelines: (p.guidelines as readonly string[]) || [],
            ranked_choices: (p.ranked_choices as string[]) || undefined,
            guesses: (p.guesses as Record<string, string>) || {},
            score: p.score ?? 0,
            ready_for_roleplay: p.ready_for_roleplay ?? false,
          }));
          setPlayers(mappedPlayers);
        }
      }
    };

    fetchLobby();

    const lobbyChannel = supabase
      .channel(`lobby:${lobbyCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lobbies",
          filter: `code=eq.${lobbyCode}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updatedLobby = payload.new as Lobby;
            currentLobbyId = updatedLobby.id;
            setLobby(updatedLobby);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lobby_players",
        },
        async (payload) => {
          // Refetch all players for the current lobby when any player changes
          if (currentLobbyId) {
            const { data } = await supabase
              .from("lobby_players")
              .select("*")
              .eq("lobby_id", currentLobbyId)
              .order("player_number", { ascending: true });
            if (data) {
              // Map players data - role_description, nicknames, guidelines, and ranked_choices should now be in database
              const mappedPlayers: LobbyPlayer[] = data.map((p: any) => ({
                ...p,
                role_description: p.role_description ?? "",
                nicknames: p.nicknames ?? "",
                guidelines: (p.guidelines as readonly string[]) || [],
                ranked_choices: (p.ranked_choices as string[]) || undefined,
                guesses: (p.guesses as Record<string, string>) || {},
                score: p.score ?? 0,
                ready_for_roleplay: p.ready_for_roleplay ?? false,
              }));
              setPlayers(mappedPlayers);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(lobbyChannel);
    };
  }, [lobbyCode]);

  const createLobby = async (
    numPlayers: number,
    playerName: string = "Player 1",
  ) => {
    setLoading(true);
    try {
      let code = "",
        isUnique = false;
      while (!isUnique) {
        const { data } = await supabase.rpc("generate_lobby_code");
        code = data as string;
        const { data: existing } = await supabase
          .from("lobbies")
          .select("id")
          .eq("code", code)
          .single();
        if (!existing) isUnique = true;
      }
      const { data: lobbyData, error } = await supabase
        .from("lobbies")
        .insert({
          code,
          host_id: crypto.randomUUID(),
          num_players: numPlayers,
          status: "waiting",
          roleplay_timer_duration: 5,
        })
        .select()
        .single();
      if (error) throw error;
      const { data: playerData } = await supabase
        .from("lobby_players")
        .insert({
          lobby_id: lobbyData.id,
          player_number: 1,
          player_name: playerName,
        })
        .select()
        .single();
      if (playerData) {
        console.log("CreateLobby - Setting myPlayerId to:", playerData.id); // Debug log
        setMyPlayerId(playerData.id);
        localStorage.setItem("myPlayerId", playerData.id);
      }
      toast.success(`Lobby created! Code: ${code}`);
      return code;
    } catch (error) {
      toast.error("Failed to create lobby");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinLobby = async (code: string, playerName: string = "Player") => {
    setLoading(true);
    try {
      console.log("Joining lobby with player name:", playerName); // Debug log
      const { data: lobbyData } = await supabase
        .from("lobbies")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("status", "waiting")
        .single();
      if (!lobbyData) {
        toast.error("Lobby not found");
        return false;
      }
      const { data: existingPlayers } = await supabase
        .from("lobby_players")
        .select("player_number")
        .eq("lobby_id", lobbyData.id);
      const playerCount = existingPlayers?.length || 0;
      if (playerCount >= lobbyData.num_players) {
        toast.error("Lobby is full");
        return false;
      }

      const insertData = {
        lobby_id: lobbyData.id,
        player_number: playerCount + 1,
        player_name: playerName,
      };
      console.log("Inserting player data:", insertData); // Debug log

      const { data: playerData } = await supabase
        .from("lobby_players")
        .insert(insertData)
        .select()
        .single();
      console.log("Player data after insert:", playerData); // Debug log

      if (playerData) {
        console.log("Setting myPlayerId to:", playerData.id); // Debug log
        setMyPlayerId(playerData.id);
        localStorage.setItem("myPlayerId", playerData.id);
      }
      toast.success(`Joined lobby ${code}!`);
      return true;
    } catch (error) {
      console.error("Error joining lobby:", error); // Debug log
      toast.error("Failed to join lobby");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLobby = async (updates: Partial<Lobby>) => {
    if (!lobby) return;
    await supabase.from("lobbies").update(updates).eq("id", lobby.id);
  };

  const updatePlayer = async (
    playerId: string,
    updates: Partial<LobbyPlayer>,
  ) => {
    await supabase.from("lobby_players").update(updates).eq("id", playerId);
  };

  const clearMyPlayerId = () => {
    setMyPlayerId(null);
    localStorage.removeItem("myPlayerId");
  };

  // Verify that myPlayerId is valid for the current lobby
  useEffect(() => {
    if (myPlayerId && players.length > 0) {
      const isPlayerInLobby = players.some((p) => p.id === myPlayerId);
      if (!isPlayerInLobby) {
        console.log("Player not found in current lobby, clearing myPlayerId");
        clearMyPlayerId();
      }
    }
  }, [myPlayerId, players]);

  return {
    lobby,
    players,
    loading,
    myPlayerId,
    createLobby,
    joinLobby,
    updateLobby,
    updatePlayer,
    clearMyPlayerId,
  };
};
