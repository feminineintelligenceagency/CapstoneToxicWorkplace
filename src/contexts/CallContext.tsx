/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, ReactNode } from 'react';
import { useCall } from '@/hooks/useCall';
import { useTranscription } from '@/hooks/useTranscription';
import type { LobbyPlayer } from '@/types/lobby';
import type { TranscriptionEntry } from '@/types/call';

interface CallContextValue {
  // Call
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  speakingPeers: Set<string>;
  callError: string | null;
  isConnecting: boolean;
  // Transcription (stored for future LLM use; only recorded during roleplay)
  getTranscriptions: () => TranscriptionEntry[];
  clearTranscriptions: () => void;
}

const CallContext = createContext<CallContextValue | null>(null);

interface CallProviderProps {
  children: ReactNode;
  lobbyCode: string;
  lobbyId: string;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  inCall: boolean;
  isRoleplayPhase: boolean;
}

export function CallProvider({
  children,
  lobbyCode,
  lobbyId,
  players,
  myPlayerId,
  inCall,
  isRoleplayPhase,
}: CallProviderProps) {
  const call = useCall({
    lobbyCode,
    lobbyId,
    players,
    myPlayerId,
    enabled: inCall,
  });

  const { getTranscriptions, clearTranscriptions } = useTranscription(
    isRoleplayPhase,
    myPlayerId
  );

  const value: CallContextValue = {
    isMuted: call.isMuted,
    setMuted: call.setMuted,
    speakingPeers: call.speakingPeers,
    callError: call.callError,
    isConnecting: call.isConnecting,
    getTranscriptions,
    clearTranscriptions,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCallContext(): CallContextValue | null {
  return useContext(CallContext);
}
