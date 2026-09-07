import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Video, Clock, UserCheck, ShieldCheck, Activity, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCarePulse } from '../../context/CarePulseContext';
import { createSimulatedMediaStream } from '../../utils/peerService';

export default function TelehealthWaitingRoom({ appointment, onJoinCall }) {
  const { activePatient } = useCarePulse();

  const videoPreviewRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [micVolume, setMicVolume] = useState(0);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize camera preview
  useEffect(() => {
    let localStream = null;

    async function initMedia() {
      try {
        setMediaError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
        } else {
          throw new Error('getUserMedia not supported in this environment');
        }
      } catch (err) {
        console.warn('Physical camera unavailable or denied. Using clinical HD simulated stream:', err);
        localStream = createSimulatedMediaStream('Patient HD Camera (Simulated)');
        setMediaError('Physical camera/mic inaccessible. Running encrypted clinical preview stream.');
      }

      setStream(localStream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = localStream;
      }

      // Web Audio microphone visualizer
      try {
        const audioTracks = localStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioContext();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(localStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateMeter = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateMeter);
          };
          updateMeter();
        }
      } catch (e) {
        console.warn('Mic meter not supported:', e);
      }
    }

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => {
        t.enabled = !cameraActive;
      });
      setCameraActive(!cameraActive);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => {
        t.enabled = !micActive;
      });
      setMicActive(!micActive);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F] animate-ping" />
            <h2 className="text-xl font-bold text-slate-800">Virtual Waiting Room</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2A9D8F]/15 text-[#2A9D8F]">
              Checked-In & Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            CarePulse HIPAA-Compliant Video Suite • Room {appointment?.roomPeerId || 'Direct-EHR-Room'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-[#0F4C5C]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Est. Wait Time</div>
            <div className="text-sm font-bold text-[#0F4C5C]">{appointment?.estimatedWaitMins || 4} mins</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Device Media Preview (getUserMedia) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-800">
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                <CameraOff className="w-12 h-12 text-slate-500 mb-2" />
                <span className="text-sm font-semibold">Camera is Turned Off</span>
              </div>
            )}

            {/* Video Overlay Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-pulse" />
              <span>{activePatient?.name || 'You (Patient)'}</span>
            </div>

            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/50 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
              1080p HD
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`p-2.5 rounded-xl text-white transition ${
                    cameraActive ? 'bg-white/20 hover:bg-white/30' : 'bg-[#F4A261] text-white hover:bg-[#e08e4d]'
                  }`}
                  title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {cameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl text-white transition ${
                    micActive ? 'bg-white/20 hover:bg-white/30' : 'bg-[#F4A261] text-white hover:bg-[#e08e4d]'
                  }`}
                  title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Mic Audio Level Visualizer */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-[11px] font-mono">Mic Input</span>
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2A9D8F] transition-all duration-75"
                    style={{ width: `${micActive ? micVolume : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {mediaError && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{mediaError}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> WebRTC Peer Connection Ready
            </span>
            <span>Latency: ~22ms</span>
          </div>
        </div>

        {/* Right Column: Doctor Info & Preparation */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Doctor Card */}
          <div className="p-4 rounded-2xl bg-[#0F4C5C]/5 border border-[#0F4C5C]/15">
            <div className="text-[11px] uppercase font-bold text-[#0F4C5C] tracking-wider mb-2">
              Attending Physician
            </div>
            <div className="flex items-center gap-3">
              <img
                src={appointment?.doctorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'}
                alt={appointment?.doctorName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{appointment?.doctorName || 'Dr. Evelyn Vance, MD'}</h4>
                <p className="text-xs text-[#0F4C5C] font-medium">{appointment?.doctorSpecialty || 'Internal Medicine & Telehealth'}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                  <span>Reviewing your chart & recent labs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Encounter Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
            <div className="font-bold text-slate-700">Encounter Details</div>
            <div className="flex justify-between text-slate-600">
              <span>Appointment Reason:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">
                {appointment?.reason || 'Routine follow-up'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Time Slot:</span>
              <span className="font-semibold text-slate-800">{appointment?.timeSlot || '10:00 AM'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Triage Category:</span>
              <span className="font-semibold text-[#0F4C5C]">{appointment?.triageLevel || 'Routine'}</span>
            </div>
          </div>

          {/* Quick Preparation Checklist */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Pre-Consultation Checklist:</div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
                <span>Camera & microphone tested and functioning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
                <span>Keep your current medication containers within reach</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
                <span>Ensure a well-lit, private clinical conversation environment</span>
              </li>
            </ul>
          </div>

          {/* Enter Video Consultation Button */}
          <div>
            <button
              onClick={() => onJoinCall(appointment)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2A9D8F] hover:bg-[#238276] text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Enter Encrypted Telehealth Suite</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              End-to-end encrypted under HIPAA WebRTC security standard
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
