import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getIceServers, WEBRTC_BROADCAST_EVENT } from '@/lib/webrtc-config';
import type { SignalingMessage } from '@/types/call';
import type { LobbyPlayer } from '@/types/lobby';

interface UseCallOptions {
  lobbyCode: string;
  lobbyId: string;
  players: LobbyPlayer[];
  myPlayerId: string | null;
  enabled: boolean;
}

const SPEAKING_THRESHOLD = 0.015;
const SPEAKING_HYSTERESIS_MS = 300;

export function useCall({
  lobbyCode,
  lobbyId,
  players,
  myPlayerId,
  enabled,
}: UseCallOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [speakingPeers, setSpeakingPeers] = useState<Set<string>>(new Set());
  const [callError, setCallError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const peerRefs = useRef<Record<string, RTCPeerConnection>>({});
  const dataChannelsRef = useRef<Record<string, RTCDataChannel>>({});
  const signalingChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const analyserRef = useRef<{ analyser: AnalyserNode; ctx: AudioContext } | null>(null);
  const localAudioCtxRef = useRef<AudioContext | null>(null);
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeakingSentRef = useRef<boolean>(false);
  const currentStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const otherPlayers = useMemo(() => players.filter((p) => p.id !== myPlayerId), [players, myPlayerId]);
  const otherPlayerIds = useMemo(() => otherPlayers.map((p) => p.id).join(','), [otherPlayers]);

  const tryPlayRemoteAudio = useCallback(() => {
    void localAudioCtxRef.current?.resume();
    Object.values(remoteAudioRefs.current).forEach((el) => {
      el.muted = false;
      el.volume = 1;
      void el.play().catch(() => {});
    });
  }, []);

  // Browsers block remote audio until a user gesture; retry after any interaction.
  useEffect(() => {
    const onInteract = () => tryPlayRemoteAudio();
    document.addEventListener("pointerdown", onInteract, { capture: true });
    document.addEventListener("keydown", onInteract, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onInteract, { capture: true });
      document.removeEventListener("keydown", onInteract, { capture: true });
    };
  }, [tryPlayRemoteAudio]);

  // Play remote streams so user hears other participants
  useEffect(() => {
    const entries = Object.entries(remoteStreams);
    entries.forEach(([peerId, stream]) => {
      let el = remoteAudioRefs.current[peerId];
      if (!el) {
        el = new Audio();
        el.autoplay = true;
        el.muted = false;
        el.volume = 1;
        el.setAttribute("playsinline", "");
        el.playsInline = true;
        el.preload = "auto";
        remoteAudioRefs.current[peerId] = el;
      }
      if (el.srcObject !== stream) {
        el.srcObject = stream;
      }
      void el.play().catch(() => {});
    });
    const currentIds = new Set(entries.map(([id]) => id));
    Object.keys(remoteAudioRefs.current).forEach((peerId) => {
      if (!currentIds.has(peerId)) {
        const audio = remoteAudioRefs.current[peerId];
        if (audio) {
          audio.srcObject = null;
          audio.pause();
          delete remoteAudioRefs.current[peerId];
        }
      }
    });
  }, [remoteStreams]);

  const sendSignaling = useCallback(
    (msg: SignalingMessage) => {
      const ch = signalingChannelRef.current;
      if (!ch) return;
      ch.send({
        type: 'broadcast',
        event: WEBRTC_BROADCAST_EVENT,
        payload: msg,
      });
    },
    []
  );

  const broadcastSpeaking = useCallback(
    (value: boolean) => {
      if (lastSpeakingSentRef.current === value) return;
      lastSpeakingSentRef.current = value;
      if (!myPlayerId) return;
      sendSignaling({ type: 'speaking', from: myPlayerId, value });
      Object.values(dataChannelsRef.current).forEach((dc) => {
        if (dc.readyState === 'open') dc.send(JSON.stringify({ type: 'speaking', value }));
      });
    },
    [myPlayerId, sendSignaling]
  );

  const updateLocalSpeaking = useCallback(() => {
    const a = analyserRef.current;
    if (!a) return;
    const data = new Uint8Array(a.analyser.frequencyBinCount);
    a.analyser.getByteFrequencyData(data);
    const avg = data.reduce((s, v) => s + v, 0) / data.length;
    const normalized = avg / 255;
    const isSpeaking = normalized > SPEAKING_THRESHOLD;

    setSpeakingPeers((prev) => {
      const next = new Set(prev);
      if (myPlayerId) {
        if (isSpeaking) next.add(myPlayerId);
        else next.delete(myPlayerId);
      }

      if (prev.size === next.size && [...prev].every((id) => next.has(id))) {
        return prev;
      }
      return next;
    });

    if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    if (isSpeaking) {
      broadcastSpeaking(true);
      speakingTimeoutRef.current = setTimeout(() => {
        speakingTimeoutRef.current = null;
        broadcastSpeaking(false);
        setSpeakingPeers((p) => {
          const n = new Set(p);
          if (myPlayerId) n.delete(myPlayerId);
          return n;
        });
      }, SPEAKING_HYSTERESIS_MS);
    } else {
      speakingTimeoutRef.current = setTimeout(() => {
        speakingTimeoutRef.current = null;
        broadcastSpeaking(false);
        setSpeakingPeers((p) => {
          const n = new Set(p);
          if (myPlayerId) n.delete(myPlayerId);
          return n;
        });
      }, SPEAKING_HYSTERESIS_MS);
    }
  }, [myPlayerId, broadcastSpeaking]);

  useEffect(() => {
    if (!enabled || !lobbyCode || !lobbyId || !myPlayerId || players.length === 0) return;

    let cancelled = false;

    const setupAnalyser = (stream: MediaStream) => {
      try {
        const ctx = new AudioContext();
        localAudioCtxRef.current = ctx;
        void ctx.resume();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyserRef.current = { analyser, ctx };
        const tick = () => {
          if (cancelled || !analyserRef.current) return;
          updateLocalSpeaking();
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      } catch {
        // ignore
      }
    };

    const setupDataChannel = (dc: RTCDataChannel, remoteId: string) => {
      dataChannelsRef.current[remoteId] = dc;
      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'speaking' && typeof msg.value === 'boolean') {
            setSpeakingPeers((prev) => {
              const next = new Set(prev);
              if (msg.value) next.add(remoteId);
              else next.delete(remoteId);
              return next;
            });
          }
        } catch {
          // ignore
        }
      };
    };

    const createPeer = (remoteId: string, asOfferer: boolean): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers: getIceServers() });
      peerRefs.current[remoteId] = pc;

      if (asOfferer) {
        const dc = pc.createDataChannel('speaking', { ordered: true });
        setupDataChannel(dc, remoteId);
      } else {
        pc.ondatachannel = (ev) => {
          if (ev.channel?.label === 'speaking') setupDataChannel(ev.channel, remoteId);
        };
      }

      const stream = currentStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      }
      pc.ontrack = (ev) => {
        if (cancelled) return;
        const t = ev.track;
        setRemoteStreams((prev) => {
          const existing = prev[remoteId];
          if (existing && t) {
            const dup = existing.getTracks().some((x) => x.id === t.id);
            if (!dup) {
              try {
                existing.addTrack(t);
              } catch {
                // ignore duplicate / wrong kind
              }
            }
            return { ...prev, [remoteId]: existing };
          }
          const stream =
            ev.streams[0] || new MediaStream(t ? [t] : []);
          return { ...prev, [remoteId]: stream };
        });
      };
      pc.onicecandidate = (ev) => {
        if (ev.candidate)
          sendSignaling({ type: 'ice', from: myPlayerId, to: remoteId, candidate: ev.candidate.toJSON() });
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setRemoteStreams((prev) => {
            const next = { ...prev };
            delete next[remoteId];
            return next;
          });
        }
      };
      return pc;
    };

    const getOrCreatePeer = (remoteId: string, asOfferer: boolean): RTCPeerConnection => {
      if (!peerRefs.current[remoteId]) return createPeer(remoteId, asOfferer);
      return peerRefs.current[remoteId];
    };

    /** One offer per pair: avoids glare (both sides offering) and "answer in stable" errors. */
    const shouldOfferTo = (remoteId: string) =>
      myPlayerId != null && myPlayerId < remoteId;

    (async () => {
      setIsConnecting(true);
      setCallError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        currentStreamRef.current = stream;
        setLocalStream(stream);
        setupAnalyser(stream);

        const channelName = `webrtc:${lobbyCode}`;
        const channel = supabase.channel(channelName, {
          config: { broadcast: { self: false } },
        });
        signalingChannelRef.current = channel;

        channel
          .on('broadcast', { event: WEBRTC_BROADCAST_EVENT }, async (payload: { payload?: SignalingMessage }) => {
            const msg = payload.payload;
            if (!msg || msg.from === myPlayerId) return;
            const from = msg.from;

            if (msg.type === 'speaking') {
              setSpeakingPeers((prev) => {
                const next = new Set(prev);
                if (msg.value) next.add(from);
                else next.delete(from);
                return next;
              });
              return;
            }

            const to = msg.to;
            if (to !== myPlayerId) return;

            if (msg.type === 'offer') {
              const pc = getOrCreatePeer(from, false);
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendSignaling({ type: 'answer', from: myPlayerId, to: from, sdp: answer });
            } else if (msg.type === 'answer') {
              const pc = peerRefs.current[from];
              if (!pc) return;
              if (pc.signalingState === 'stable') return;
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            } else if (msg.type === 'ice') {
              const pc = peerRefs.current[from];
              if (!pc) return;
              try {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
              } catch {
                // Often arrives before remoteDescription; browser may reject out-of-order ICE.
              }
            }
          })
          .subscribe(async (status) => {
            if (status !== 'SUBSCRIBED' || cancelled) return;
            for (const p of otherPlayers) {
              const remoteId = p.id;
              if (!shouldOfferTo(remoteId)) continue;
              const pc = createPeer(remoteId, true);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendSignaling({ type: 'offer', from: myPlayerId, to: remoteId, sdp: offer });
            }
          });
      } catch (e) {
        if (!cancelled) {
          setCallError(e instanceof Error ? e.message : 'Could not start call');
        }
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    })();

    return () => {
      cancelled = true;
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
      Object.values(peerRefs.current).forEach((pc) => {
        pc.close();
      });
      peerRefs.current = {};
      dataChannelsRef.current = {};
      if (analyserRef.current) {
        analyserRef.current.ctx.close();
        analyserRef.current = null;
      }
      localAudioCtxRef.current = null;
      const streamToStop = currentStreamRef.current;
      currentStreamRef.current = null;
      if (streamToStop) {
        streamToStop.getTracks().forEach((t) => t.stop());
      }
      setLocalStream(null);
      setRemoteStreams({});
      setSpeakingPeers(new Set());
      Object.values(remoteAudioRefs.current).forEach((audio) => {
        audio.srcObject = null;
        audio.pause();
      });
      remoteAudioRefs.current = {};
      signalingChannelRef.current?.unsubscribe();
      signalingChannelRef.current = null;
    };
  }, [enabled, lobbyCode, lobbyId, myPlayerId, players.length, otherPlayers, otherPlayerIds, sendSignaling, updateLocalSpeaking]);

  const setMuted = useCallback(
    (muted: boolean) => {
      setIsMuted(muted);
      setLocalStream((stream) => {
        if (stream) stream.getAudioTracks().forEach((t) => (t.enabled = !muted));
        return stream;
      });
      tryPlayRemoteAudio();
    },
    [tryPlayRemoteAudio],
  );

  return {
    localStream,
    remoteStreams,
    isMuted,
    setMuted,
    speakingPeers,
    callError,
    isConnecting,
    /** Call after a user gesture if remote audio is silent (browser autoplay policy). */
    resumeRemoteAudio: tryPlayRemoteAudio,
  };
}
