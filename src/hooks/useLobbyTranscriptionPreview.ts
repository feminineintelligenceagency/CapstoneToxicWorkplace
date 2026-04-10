import { useRef, useEffect, useState, useCallback } from "react";
import { isSpeechRecognitionSupported } from "@/lib/speechRecognitionSupport";

// Web Speech API (minimal typings)
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

const MAX_COMMITTED_LINES = 18;

const SpeechRecognitionAPI: SpeechRecognitionConstructor | null =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition || null
    : null;

const previewSupported = () => isSpeechRecognitionSupported() && SpeechRecognitionAPI !== null;

/**
 * Lobby-only live captions from your mic for debugging Web Speech.
 * Nothing is persisted or sent to the server.
 */
export function useLobbyTranscriptionPreview(active: boolean, myPlayerId: string | null) {
  const [committed, setCommitted] = useState<Array<{ id: string; text: string }>>([]);
  const [interim, setInterim] = useState("");
  const pendingInterimRef = useRef("");
  const recognitionLiveRef = useRef<InstanceType<
    NonNullable<typeof SpeechRecognitionAPI>
  > | null>(null);
  const listenRef = useRef(false);

  const isSupported = previewSupported();

  const ensureStarted = useCallback(() => {
    const r = recognitionLiveRef.current;
    if (!r || !listenRef.current) return;
    try {
      r.start();
    } catch {
      // already running
    }
  }, []);

  useEffect(() => {
    if (!active || !myPlayerId || !SpeechRecognitionAPI) {
      recognitionLiveRef.current = null;
      if (!active) {
        setInterim("");
      }
      return;
    }

    listenRef.current = true;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionLiveRef.current = recognition;

    const flushPendingToCommitted = () => {
      const text = pendingInterimRef.current.trim();
      pendingInterimRef.current = "";
      if (!text) return;
      setCommitted((prev) => {
        const next = [
          ...prev,
          { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, text },
        ];
        return next.slice(-MAX_COMMITTED_LINES);
      });
      setInterim("");
    };

    recognition.onresult = (event: Event & SpeechRecognitionEventMap) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const raw = result[0]?.transcript ?? "";
        const text = raw.trim();
        if (result.isFinal && text) {
          pendingInterimRef.current = "";
          setInterim("");
          setCommitted((prev) => {
            const next = [
              ...prev,
              { id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`, text },
            ];
            return next.slice(-MAX_COMMITTED_LINES);
          });
        } else if (!result.isFinal && text) {
          pendingInterimRef.current = raw.trim();
          setInterim(raw.trim());
        }
      }
    };

    recognition.onend = () => {
      flushPendingToCommitted();
      if (!listenRef.current) return;
      try {
        recognition.start();
      } catch {
        // ignore
      }
    };

    recognition.onerror = (event: Event & SpeechRecognitionErrorEventMap) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        console.warn("[lobby-caption-preview]", event.error);
      }
    };

    ensureStarted();

    const onGesture = () => ensureStarted();
    document.addEventListener("pointerdown", onGesture, { capture: true });
    document.addEventListener("keydown", onGesture, { capture: true });

    return () => {
      listenRef.current = false;
      document.removeEventListener("pointerdown", onGesture, { capture: true });
      document.removeEventListener("keydown", onGesture, { capture: true });
      flushPendingToCommitted();
      recognitionLiveRef.current = null;
      try {
        recognition.stop();
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [active, myPlayerId, ensureStarted]);

  return {
    isSupported,
    committedLines: committed,
    interimLine: interim,
    ensureStarted,
    clearPreview: useCallback(() => {
      setCommitted([]);
      setInterim("");
      pendingInterimRef.current = "";
    }, []),
  };
}
