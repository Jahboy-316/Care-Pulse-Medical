import Peer from 'peerjs';

/**
 * Creates a synthetic fallback MediaStream with a simulated medical video feed and audio
 * in case physical webcam/microphone are unavailable, permissions are denied, or in headless testing.
 */
export function createSimulatedMediaStream(label = 'Doctor Feed') {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let frame = 0;
  function draw() {
    frame++;
    // Dark medical teal gradient background
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#0F4C5C');
    grad.addColorStop(1, '#0A2E38');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Grid lines for clinical monitor aesthetic
    ctx.strokeStyle = 'rgba(42, 157, 143, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 640; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 0; y < 480; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }

    // Doctor / Clinical silhouette or avatar circle
    ctx.beginPath();
    ctx.arc(320, 200, 70, 0, Math.PI * 2);
    ctx.fillStyle = '#2A9D8F';
    ctx.fill();

    // Doctor cross icon or stethoscope aesthetic
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(312, 170, 16, 60);
    ctx.fillRect(290, 192, 60, 16);

    // Live wave pulse across screen
    ctx.beginPath();
    ctx.strokeStyle = '#E9C46A';
    ctx.lineWidth = 3;
    for (let x = 0; x < 640; x += 4) {
      const y = 380 + Math.sin((x + frame * 4) * 0.05) * 25 * (x > 250 && x < 390 ? 1.8 : 0.6);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Stream status labels
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(`${label} • ENCRYPTED WEBRTC FEED`, 320, 320);

    ctx.font = '13px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#A7F3D0';
    ctx.fillText(`CAREPULSE HD LIVE • ${(30 + Math.sin(frame * 0.1) * 0.2).toFixed(1)} FPS`, 320, 345);

    requestAnimationFrame(draw);
  }
  draw();

  const stream = canvas.captureStream(30);

  // Audio track using Web Audio silent or subtle oscillator
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.001; // extremely low/inaudible clinical carrier
    osc.connect(gain);
    const dest = audioCtx.createMediaStreamDestination();
    gain.connect(dest);
    osc.start();
    const audioTrack = dest.stream.getAudioTracks()[0];
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }
  } catch (e) {
    console.warn('Could not generate Web Audio track:', e);
  }

  return stream;
}

/**
 * Initializes a PeerJS instance connected to wss://0.peerjs.com
 */
export function initializePeer(customId = null) {
  const options = {
    host: '0.peerjs.com',
    port: 443,
    path: '/',
    secure: true,
    debug: 1
  };

  const peerId = customId || `carepulse-${Math.random().toString(36).substring(2, 9)}`;
  const peer = new Peer(peerId, options);
  return peer;
}
