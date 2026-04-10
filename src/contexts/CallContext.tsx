/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, ReactNode } from 'react';
import { useCall } from '@/hooks/useCall';
import type { LobbyPlayer } from '@/types/lobby';
import type { TranscriptionEntry } from '@/types/call';

interface CallContextValue {
  // Call
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  resumeRemoteAudio: () => void;
  /** Mic + Web Speech often need the same user gesture (click / key). */
  resumeCallMedia: () => void;
  speakingPeers: Set<string>;
  callError: string | null;
  isConnecting: boolean;
  // Transcription (stored for future LLM use; only recorded during roleplay)
  getTranscriptions: () => TranscriptionEntry[];
  clearTranscriptions: () => void;
  ensureTranscriptionStarted: () => void;
}

const CallContext = createContext<CallContextValue | null>(null);

interface CallProviderProps {
  children: ReactNode;
  lobbyCode: string;
  lobbyId: string;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  inCall: boolean;
  /** Single shared transcription buffer (must be the same instance used for DB upload in Lobby). */
  getTranscriptions: () => TranscriptionEntry[];
  clearTranscriptions: () => void;
  ensureTranscriptionStarted: () => void;
}

export function CallProvider({
  children,
  lobbyCode,
  lobbyId,
  players,
  myPlayerId,
  inCall,
  getTranscriptions,
  clearTranscriptions,
  ensureTranscriptionStarted,
}: CallProviderProps) {
  const call = useCall({
    lobbyCode,
    lobbyId,
    players,
    myPlayerId,
    enabled: inCall,
  });

  const resumeCallMedia = () => {
    call.resumeRemoteAudio();
    ensureTranscriptionStarted();
  };

  const value: CallContextValue = {
    isMuted: call.isMuted,
    setMuted: call.setMuted,
    resumeRemoteAudio: call.resumeRemoteAudio,
    resumeCallMedia,
    speakingPeers: call.speakingPeers,
    callError: call.callError,
    isConnecting: call.isConnecting,
    getTranscriptions,
    clearTranscriptions,
    ensureTranscriptionStarted,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCallContext(): CallContextValue | null {
  return useContext(CallContext);
}
