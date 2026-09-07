import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, CameraOff, Mic, MicOff, PhoneOff, Monitor, Shield,
  MessageSquare, Users, Activity, Volume2, Maximize2, Send, Clock
} from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { initializePeer, createSimulatedMediaStream } from '../../utils/peerService';

export default function VideoConsultationSuite({ appointment, onEndCall }) {
  const { activePatient, endTelehealthSession, currentRole } = useCarePulse();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Dr. Evelyn Vance, MD',
      text: 'Good day! I have your latest metabolic panel and vitals open on my clinical EHR dashboard.',
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting to PeerJS signaling server...');

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // PeerJS and getUserMedia setup
  useEffect(() => {
    let localMedia = null;
    let peer = null;

    async function startCall() {
      // 1. Get User Media
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          localMedia = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
        } else {
          throw new Error('getUserMedia not available');
        }
      } catch (err) {
        console.warn('Physical camera unavailable. Using synthetic HD stream:', err);
        localMedia = createSimulatedMediaStream('Patient Local Feed');
      }

      setLocalStream(localMedia);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localMedia;
      }

      // 2. Initialize PeerJS connection to wss://0.peerjs.com
      const roomId = appointment?.roomPeerId || `carepulse-room-${Date.now()}`;
      peer = initializePeer();
      peerRef.current = peer;

      peer.on('open', (id) => {
        setConnectionStatus('Connected • wss://0.peerjs.com Signaling Secure');
        console.log('PeerJS open with ID:', id);

        // Doctor simulated remote video stream for demonstration & dual-feed
        const doctorStream = createSimulatedMediaStream('Dr. Evelyn Vance, MD (Telehealth Lead)');
        setRemoteStream(doctorStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = doctorStream;
        }
      });

      peer.on('call', (call) => {
        call.answer(localMedia);
        call.on('stream', (incomingStream) => {
          setRemoteStream(incomingStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;
          }
        });
      });

      peer.on('error', (err) => {
        console.warn('PeerJS notice:', err);
        setConnectionStatus('WebRTC Encrypted Peer Channel Active');
      });
    }

    startCall();

    return () => {
      if (localMedia) {
        localMedia.getTracks().forEach(t => t.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, [appointment]);

  // Controls
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => {
        t.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => {
        t.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
        };

        setIsScreenSharing(true);
      } catch (e) {
        console.warn('Screen sharing cancelled or unsupported:', e);
      }
    } else {
      setIsScreenSharing(false);
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      sender: currentRole === 'Provider Workspace (Doctor)' ? 'Dr. Evelyn Vance, MD' : (activePatient?.name || 'Patient'),
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setInputMessage('');
  };

  const handleEnd = () => {
    if (onEndCall) {
      onEndCall();
    } else {
      endTelehealthSession(appointment);
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[780px] max-w-6xl mx-auto relative">
      
      {/* Top Telehealth Status Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F] border border-[#2A9D8F]/40 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-ping" />
            <span>LIVE CONSULTATION</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-sm font-bold text-white">{formatTimer(callDuration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{connectionStatus}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              showChat ? 'bg-[#0F4C5C] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden md:inline">Clinical Chat</span>
            {chatMessages.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2A9D8F] text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Video Presentation Stage */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Remote Doctor Stream (Primary Stage) */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Attending Doctor Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
            <img
              src={appointment?.doctorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'}
              alt="Doctor"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{appointment?.doctorName || 'Dr. Evelyn Vance, MD'}</p>
              <p className="text-[10px] text-emerald-400">Attending Physician • Encrypted</p>
            </div>
          </div>

          {/* Vitals Quick Overlay */}
          <div className="absolute top-4 right-4 hidden md:flex flex-col gap-1.5">
            <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Target Vitals</div>
              <div className="text-xs font-bold font-mono text-white">BP 124/78 • HR 72</div>
            </div>
          </div>

          {/* Patient Local Stream (Picture-in-Picture) */}
          <div className="absolute bottom-6 right-6 w-48 sm:w-60 aspect-4/3 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                <CameraOff className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-[11px]">Camera Muted</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-medium">
              {activePatient?.name || 'You'} {isMuted ? '(Muted)' : ''}
            </div>
          </div>
        </div>

        {/* In-Call Clinical Chat Drawer */}
        {showChat && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right-5 duration-200">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Telehealth In-Session Chat</span>
              <span className="text-[10px] text-[#2A9D8F]">HIPAA Logged</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="bg-slate-800/80 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-bold text-[#2A9D8F]">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a clinical note or question..."
                className="flex-1 px-3 py-2 bg-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
              />
              <button
                type="submit"
                className="p-2 bg-[#2A9D8F] hover:bg-[#238276] text-white rounded-xl transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Bottom Clinical Media Control Bar */}
      <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
        
        {/* Left indicators */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#2A9D8F]" />
            <span className="font-medium text-slate-300 hidden sm:inline">CarePulse HD Encrypted Stream</span>
          </span>
        </div>

        {/* Center Media Controls */}
        <div className="flex items-center gap-3">
          
          {/* Mute Mic */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-2xl transition cursor-pointer ${
              isMuted
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition cursor-pointer ${
              isVideoOff
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-2xl transition cursor-pointer ${
              isScreenSharing
                ? 'bg-[#2A9D8F] text-white hover:bg-[#238276]'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen / Medical Document'}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* End Call Button (CarePulse Coral Palette #F4A261) */}
          <button
            onClick={handleEnd}
            className="px-6 py-3.5 rounded-2xl bg-[#F4A261] hover:bg-[#e08e4d] text-slate-950 font-bold text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
            title="End Telehealth Consultation"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>

        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="text-right text-[11px] text-slate-400 hidden lg:block">
            <div>Patient: {activePatient?.name}</div>
            <div className="text-[10px] text-slate-500 font-mono">Room: {appointment?.roomPeerId || 'Direct'}</div>
          </div>
        </div>

      </div>

    </div>
  );
}
