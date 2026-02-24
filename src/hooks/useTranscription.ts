import { useRef, useEffect } from 'react';
import type { TranscriptionEntry } from '@/types/call';

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
  };
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const SpeechRecognitionAPI: SpeechRecognitionConstructor | null =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition || null
    : null;

export function useTranscription(active: boolean, myPlayerId: string | null) {
  const transcriptionsRef = useRef<TranscriptionEntry[]>([]);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognitionAPI>> | null>(null);

  useEffect(() => {
    if (!active || !myPlayerId || !SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: Event & SpeechRecognitionEventMap) => {
      const last = event.resultIndex;
      const result = event.results[last];
      if (result.isFinal && result[0]?.transcript) {
        const text = result[0].transcript.trim();
        if (text) {
          transcriptionsRef.current.push({
            playerId: myPlayerId,
            text,
            timestamp: Date.now(),
          });
        }
      }
    };

    recognition.onerror = (event: Event & SpeechRecognitionErrorEventMap) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('Speech recognition error:', event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
        recognition.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [active, myPlayerId]);

  return {
    transcriptionsRef,
    getTranscriptions: (): TranscriptionEntry[] => [...transcriptionsRef.current],
    clearTranscriptions: () => {
      transcriptionsRef.current = [];
    },
  };
}
