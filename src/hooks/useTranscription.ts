import { useRef, useEffect, useCallback } from "react";
import type { TranscriptionEntry } from "@/types/call";
import { isSpeechRecognitionSupported } from "@/lib/speechRecognitionSupport";

// Web Speech API types (not in all TS DOM libs)
interface SpeechRecognitionEventMap {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEventMap {
  error: string;
}

interface SpeechRecognitionConstructor {
  new (): {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: Event & SpeechRecognitionEventMap) => void) | null;
    onerror: ((event: Event & SpeechRecognitionErrorEventMap) => void) | null;
    onend: (() => void) | null;
  };
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/** @deprecated use isSpeechRecognitionSupported from @/lib/speechRecognitionSupport */
export const isSpeechRecognitionAvailable = isSpeechRecognitionSupported;

const SpeechRecognitionAPI: SpeechRecognitionConstructor | null =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition || null
    : null;

export function useTranscription(active: boolean, myPlayerId: string | null) {
  const transcriptionsRef = useRef<TranscriptionEntry[]>([]);
  const pendingInterimRef = useRef<string>("");
  /** Live recognition instance for gesture retries (must match effect cleanup). */
  const recognitionLiveRef = useRef<InstanceType<
    NonNullable<typeof SpeechRecognitionAPI>
  > | null>(null);
  const listenRef = useRef(false);

  const tryStartRecognition = useCallback(() => {
    const r = recognitionLiveRef.current;
    if (!r || !listenRef.current) return;
    try {
      r.start();
    } catch {
      // InvalidStateError: already running — expected on repeated gestures
    }
  }, []);

  useEffect(() => {
    if (!active || !myPlayerId) {
      recognitionLiveRef.current = null;
      return;
    }
    if (!SpeechRecognitionAPI) {
      console.warn(
        "[transcription] Web Speech API not available (use Chrome or Edge on desktop for speech-to-text).",
      );
      return;
    }

    listenRef.current = true;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionLiveRef.current = recognition;

    const flushPendingInterim = () => {
      const text = pendingInterimRef.current.trim();
      pendingInterimRef.current = "";
      if (!text) return;
      transcriptionsRef.current.push({
        playerId: myPlayerId,
        text,
        timestamp: Date.now(),
      });
    };

    recognition.onresult = (event: Event & SpeechRecognitionEventMap) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const raw = result[0]?.transcript ?? "";
        const text = raw.trim();
        if (result.isFinal && text) {
          pendingInterimRef.current = "";
          transcriptionsRef.current.push({
            playerId: myPlayerId,
            text,
            timestamp: Date.now(),
          });
        } else if (!result.isFinal && text) {
          pendingInterimRef.current = raw.trim();
        }
      }
    };

    recognition.onend = () => {
      flushPendingInterim();
      if (!listenRef.current) return;
      try {
        recognition.start();
      } catch {
        // InvalidStateError: already started — ignore
      }
    };

    recognition.onerror = (event: Event & SpeechRecognitionErrorEventMap) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        console.error(
          "[transcription] Speech recognition blocked or no mic access:",
          event.error,
          "— allow microphone and use “Enable call audio and mic transcription”.",
        );
        return;
      }
      console.warn("[transcription] Speech recognition error:", event.error);
    };

    // First start often fails without a recent user gesture; pointerdown retries fix it.
    tryStartRecognition();

    const onGesture = () => tryStartRecognition();
    document.addEventListener("pointerdown", onGesture, { capture: true });
    document.addEventListener("keydown", onGesture, { capture: true });

    return () => {
      listenRef.current = false;
      document.removeEventListener("pointerdown", onGesture, { capture: true });
      document.removeEventListener("keydown", onGesture, { capture: true });
      flushPendingInterim();
      recognitionLiveRef.current = null;
      try {
        recognition.stop();
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [active, myPlayerId, tryStartRecognition]);

  const getTranscriptions = useCallback(
    (): TranscriptionEntry[] => [...transcriptionsRef.current],
    [],
  );

  const clearTranscriptions = useCallback(() => {
    transcriptionsRef.current = [];
  }, []);

  return {
    transcriptionsRef,
    getTranscriptions,
    clearTranscriptions,
    /** Call from the same UI control as “Enable incoming audio” (needs user gesture). */
    ensureRecognitionStarted: tryStartRecognition,
  };
}
