import express from "express";
import { RTCPeerConnection, RTCSessionDescription } from "wrtc";
import { SpeechClient } from "@google-cloud/speech";
import { Writable } from "stream";

const app = express();
const port = 3000;

// Initialize Google Cloud Speech client
const speechClient = new SpeechClient({
  keyFilename: "/nix/store/shkw4qm9q07gn6hgb4pdim3dl00pb5ck-cfg/keyfile.json",
});

// Create a writable stream to send audio data to the transcription service
const transcriptionStream = new Writable({
  write: async (chunk, encoding, callback) => {
    // Configure request
    const request = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
      interimResults: false,
    };

    // Create a recognize stream
    const recognizeStream = speechClient
      .streamingRecognize(request)
      .on("data", (data) => {
        // Handle transcription
        console.log(
          `Transcription: ${data.results[0].alternatives[0].transcript}`,
        );
      })
      .on("error", (err) => {
        console.error("Error in transcription stream:", err);
      });

    // Pipe audio chunk to the transcription stream
    recognizeStream.write(chunk);
    callback();
  },
});

// Handle WebRTC signaling
app.post("/offer", async (req, res) => {
  const { offer } = req.body;

  const pc = new RTCPeerConnection();

  // Create an audio track and handle incoming audio stream
  pc.ontrack = (event) => {
    const remoteAudioStream = event.streams[0];
    console.log("Receiving remote audio stream");

    // Pipe the remote audio stream to the transcription stream
    remoteAudioStream.getAudioTracks().forEach((track) => {
      const mediaStream = new MediaStream([track]);
      const audioReader = mediaStream.getAudioTracks()[0].readable.getReader();
      const audioOutputStream = new Writable({
        write: (chunk, _, done) => {
          transcriptionStream.write(chunk);
          done();
        },
      });

      audioReader.read().then(function processText({ done, value }) {
        if (done) {
          audioReader.releaseLock();
          return;
        }
        audioOutputStream.write(value);
        return audioReader.read().then(processText);
      });
    });
  };

  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    res.json({ answer: pc.localDescription });
  } catch (error) {
    console.error("Error handling offer:", error);
    res.status(500).send("Error processing offer");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
