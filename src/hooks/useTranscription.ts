import { useRef, useEffect } from 'react';
import type { TranscriptionEntry } from '@/types/call';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
