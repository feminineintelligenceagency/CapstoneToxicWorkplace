# Live Call and Transcription

## Overview

- **WebRTC** is used for peer-to-peer audio. When you create or join a lobby, you are automatically in a live call.
- **Speech Recognition** (Browser / `webkitSpeechRecognition`) is used to transcribe speech only during the **roleplay phase**. Transcriptions are stored for future LLM use and are not sent anywhere yet.
- **UI**: Mute/unmute and a "who is talking" indicator (e.g. border around the player in the lobby and in the roleplay phase).

## Environment variables

All call-related keys go in `.env` (and optionally `.env.example` for your team).

### Required (already used by the app)

- **`VITE_SUPABASE_URL`** – Supabase project URL (used for lobby data and WebRTC signaling).
- **`VITE_SUPABASE_PUBLISHABLE_KEY`** – Supabase anon/publishable key (used for API and Realtime).

### Optional (WebRTC only)

- **`VITE_TURN_URL`** – TURN server URL (e.g. `turn:your-turn.example.com:3478`). Only needed if users are behind strict NATs/firewalls where STUN is not enough.
- **`VITE_TURN_USERNAME`** – TURN username (if your TURN server uses auth).
- **`VITE_TURN_CREDENTIAL`** – TURN credential (if your TURN server uses auth).

If these three are set, the app will add the TURN server to the WebRTC ICE config. Otherwise, only the default STUN server (`stun:stun.l.google.com:19302`) is used.

**No keys are required for the Browser Speech Recognition API**; it runs entirely in the client and does not use API keys.

## Where things live

- **WebRTC / call**: `src/hooks/useCall.ts`, `src/lib/webrtc-config.ts`, `src/contexts/CallContext.tsx`.
- **Transcription**: `src/hooks/useTranscription.ts`. Transcriptions are kept in a ref and exposed via `getTranscriptions()` for future use (e.g. LLM).
- **Types**: `src/types/call.ts` (`SignalingMessage`, `TranscriptionEntry`).
- **UI**: Lobby waiting room and roleplay phase use `useCallContext()` for mute and "who is talking" (e.g. border); transcription notice is shown in both.

## Transcriptions

- Recorded **only** when the game phase is **roleplay**; they start when the roleplay phase starts and stop when it ends.
- Stored as `{ playerId, text, timestamp }[]` and are **not** sent to any backend or LLM in this implementation; they are intended for a future integration.
