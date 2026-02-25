const express = require('express');
const { RTCPeerConnection, RTCSessionDescription } = require('wrtc');

const app = express();
const port = 3000;

app.use(express.json());

// Handle WebRTC signaling
app.post('/offer', async (req, res) => {
    const { offer } = req.body;

    const pc = new RTCPeerConnection();

    // Create an audio track and handle incoming audio stream
    pc.ontrack = (event) => {
        const remoteAudioStream = event.streams[0];
        console.log('Receiving remote audio stream');

        // Here you can process the audio stream
        // For example, you could send it to a transcription service
    };

    try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        res.json({ answer: pc.localDescription });
    } catch (error) {
        console.error('Error handling offer:', error);
        res.status(500).send('Error processing offer');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
