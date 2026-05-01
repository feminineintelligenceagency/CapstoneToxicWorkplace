# Role Guessers

Role Guessers is a roleplay-based social deduction training application.  
Its core purpose is to help women recognize and respond to toxic workplace archetypes and dynamics in a controlled, repeatable environment.

## Project Purpose

This project is designed to:

- Expose players to realistic toxic behavior patterns through structured scenarios.
- Build pattern recognition for manipulative, coercive, dismissive, and undermining archetypes.
- Practice verbal response strategies in live roleplay before real-world exposure.
- Provide reflection through post-round scoring and LLM-assisted summaries.

The goal is not only gameplay; it is experiential learning and preparation.

## How the Experience Works

1. Create or join a lobby.
2. Choose a scenario (Toxic Workplace flow is currently implemented).
3. Receive a hidden role with behavioral guidelines.
4. Complete timed roleplay while voice and transcripts are captured.
5. Enter the guessing phase and identify other players' archetypes.
6. Review results, scores, and roleplay feedback.

## Core Features

- Lobby-based multiplayer sessions.
- Scenario-driven role assignment with roleplay guidelines.
- Built-in voice call support (WebRTC).
- Speech transcription during roleplay.
- Guessing and scoring phases.
- LLM-assisted roleplay grading and player summaries.
- Scenario editor with asset support.

## Installation and Setup

```bash
git clone https://github.com/msuedago/CapstoneToxicWorkplace.git
cd CapstoneToxicWorkplace
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```

## Documentation

Technical and operational docs are in [`docs/`](./docs/README.md):

- [Engineering handbook](./docs/ENGINEERING_HANDBOOK.md): architecture, APIs, components, handoff.
- [Call and transcription](./docs/CALL_AND_TRANSCRIPTION.md): WebRTC, speech recognition, environment variables.
- [Scenario manager](./docs/SCENARIO_MANAGER.md): scenario editing and asset management.

