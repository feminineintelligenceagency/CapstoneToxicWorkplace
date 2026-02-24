export type SignalingMessage =
  | { type: 'offer'; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice'; from: string; to: string; candidate: RTCIceCandidateInit }
  | { type: 'speaking'; from: string; value: boolean };

export interface TranscriptionEntry {
  playerId: string;
  text: string;
  timestamp: number;
}
