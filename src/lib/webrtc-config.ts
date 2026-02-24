/**
 * WebRTC configuration. STUN is used for NAT traversal; TURN is optional for strict networks.
 * Add VITE_TURN_URL, VITE_TURN_USERNAME, VITE_TURN_CREDENTIAL to .env if using TURN.
 */
const DEFAULT_STUN = 'stun:stun.l.google.com:19302';

export function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [{ urls: DEFAULT_STUN }];
  const turnUrl = import.meta.env.VITE_TURN_URL as string | undefined;
  const turnUser = import.meta.env.VITE_TURN_USERNAME as string | undefined;
  const turnCred = import.meta.env.VITE_TURN_CREDENTIAL as string | undefined;
  if (turnUrl && turnUser && turnCred) {
    servers.push({ urls: turnUrl, username: turnUser, credential: turnCred });
  }
  return servers;
}

export const WEBRTC_BROADCAST_EVENT = 'webrtc';
