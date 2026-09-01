import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, MessageSquare, 
  PhoneOff, Heart, Activity, Thermometer, ShieldCheck, X, Send, FileText, CheckCircle 
} from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface VideoConsultationRoomProps {
  doctorName: string;
  doctorSpecialty: string;
  doctorFacility: string;
  patientName: string;
  abhaId: string;
  userRole: 'patient' | 'doctor';
  onEndCall: () => void;
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  doctorName,
  doctorSpecialty,
  doctorFacility,
  patientName,
  abhaId,
  userRole,
  onEndCall,
}) => {
  // Media controls state
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [prescOpen, setPrescOpen] = useState(false);
  
  // Call duration timer
  const [callSeconds, setCallSeconds] = useState(0);

  // Live Chat messages
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: doctorName, text: 'Namaste! Can you hear and see me clearly?', time: '10:15 AM' },
    { sender: patientName, text: 'Namaste Doctor, yes audio and video are crisp.', time: '10:15 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Live Vitals State (Simulated live patient telemetry)
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bp: '120/80',
    spO2: 98,
    temp: 98.6,
  });

  // Doctor in-call prescription form state
  const [prescNotes, setPrescNotes] = useState('');
  const [prescSuccess, setPrescSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);

    // Simulate subtle heart rate fluctuation
    const vitalsInterval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 5),
        spO2: 97 + Math.floor(Math.random() * 3),
      }));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(vitalsInterval);
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const myName = userRole === 'patient' ? patientName : doctorName;
    setMessages(prev => [
      ...prev,
      { sender: myName, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
  };

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setPrescSuccess(true);
    setTimeout(() => {
      setPrescSuccess(false);
      setPrescOpen(false);
    }, 2000);
  };

  // Video feed URLs
  const doctorVideoUrl = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop";
  const patientVideoUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop";

  const mainVideo = userRole === 'patient' ? doctorVideoUrl : patientVideoUrl;
  const selfVideo = userRole === 'patient' ? patientVideoUrl : doctorVideoUrl;
  const peerName = userRole === 'patient' ? doctorName : patientName;

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
      
      {/* 1. Header Teleconsult Info Bar */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <span>{peerName}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                LIVE HD
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {userRole === 'patient' ? `${doctorSpecialty} • ${doctorFacility}` : `ABHA #${abhaId} • ${patientName}`}
            </p>
          </div>
        </div>

        {/* Timer & Encryption Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{formatTimer(callSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span className="hidden sm:inline">ABDM Encrypted</span>
          </div>
        </div>
      </div>

      {/* 2. Main Live Video Canvas */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
        
        {/* Main Peer Feed */}
        {cameraActive ? (
          <img
            src={mainVideo}
            alt="Live Teleconsultation Feed"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
            <VideoOff className="h-12 w-12" />
            <p className="text-xs font-medium">Camera turned off by user</p>
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Live Patient Vitals Telemetry Bar (Overlay Top-Left) */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 text-white space-y-2 z-10 shadow-lg max-w-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-time Vitals Telemetry</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
              <div>
                <span className="text-[9px] text-slate-400 block">Pulse</span>
                <strong className="text-white font-mono">{vitals.heartRate} bpm</strong>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-400 block">BP</span>
                <strong className="text-white font-mono">{vitals.bp}</strong>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sky-400 font-bold text-xs">O₂</span>
              <div>
                <span className="text-[9px] text-slate-400 block">SpO₂</span>
                <strong className="text-white font-mono">{vitals.spO2}%</strong>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-amber-400" />
              <div>
                <span className="text-[9px] text-slate-400 block">Temp</span>
                <strong className="text-white font-mono">{vitals.temp}°F</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Self View (Picture-in-Picture) Bottom Right */}
        <div className="absolute bottom-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 z-10">
          <img
            src={selfVideo}
            alt="Self Camera Feed"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] text-slate-200 font-bold">
            You ({userRole.toUpperCase()})
          </div>
        </div>

        {/* 3. In-Call Chat Drawer (Overlay Right) */}
        {chatOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-lg border-l border-slate-800 p-4 flex flex-col z-20 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" /> In-Call Live Chat
              </h4>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/50 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a clinical note or message..."
                className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 outline-none focus:border-emerald-500"
              />
              <button type="submit" className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* 4. Doctor Live E-Prescription Drawer (Overlay Left for Doctor) */}
        {prescOpen && userRole === 'doctor' && (
          <div className="absolute top-0 left-0 bottom-0 w-84 bg-slate-900/95 backdrop-blur-lg border-r border-slate-800 p-4 flex flex-col z-20 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-400" /> Write Live E-Prescription
              </h4>
              <button onClick={() => setPrescOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleIssuePrescription} className="flex-1 flex flex-col justify-between py-3 space-y-4">
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Patient ABHA Profile</label>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <p className="font-bold text-white">{patientName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ABHA #{abhaId}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Clinical Notes & Rx</label>
                  <textarea
                    rows={4}
                    value={prescNotes}
                    onChange={e => setPrescNotes(e.target.value)}
                    placeholder="e.g. Tab Sorbilate 5mg 1-0-1 under tongue. Refer to IGMC Cath Lab for 2D Echo..."
                    className="w-full bg-slate-800 text-white text-xs rounded-xl p-3 border border-slate-700 outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              {prescSuccess ? (
                <div className="bg-emerald-950 text-emerald-300 p-3 rounded-xl border border-emerald-800 flex items-center gap-2 text-xs font-bold">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>E-Prescription signed & attached to ABHA thread!</span>
                </div>
              ) : (
                <Button type="submit" variant="primary" className="w-full">
                  Sign & Issue E-Prescription
                </Button>
              )}
            </form>
          </div>
        )}

      </div>

      {/* 5. Bottom Call Controls Floating Toolbar */}
      <div className="h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline font-mono">Session ID: #TC-8273-HP</span>
        </div>

        {/* Main Interactive Controls */}
        <div className="flex items-center gap-3">
          {/* Mute Mic */}
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-3.5 rounded-2xl border transition-all ${
              micActive 
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                : 'bg-rose-600 border-rose-500 text-white animate-pulse'
            }`}
            title={micActive ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Toggle Camera */}
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-3.5 rounded-2xl border transition-all ${
              cameraActive 
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                : 'bg-rose-600 border-rose-500 text-white animate-pulse'
            }`}
            title={cameraActive ? "Turn Off Camera" : "Turn On Camera"}
          >
            {cameraActive ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setScreenSharing(!screenSharing)}
            className={`p-3.5 rounded-2xl border transition-all hidden sm:flex ${
              screenSharing 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
            }`}
            title="Share Screen / Diagnostic ECG"
          >
            <Monitor className="h-5 w-5" />
          </button>

          {/* In-Call Chat */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-3.5 rounded-2xl border transition-all relative ${
              chatOpen 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
            }`}
            title="Open Live Chat"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </button>

          {/* Doctor E-Prescription Drawer Toggle */}
          {userRole === 'doctor' && (
            <button
              onClick={() => setPrescOpen(!prescOpen)}
              className={`p-3.5 rounded-2xl border transition-all ${
                prescOpen 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              }`}
              title="Issue E-Prescription"
            >
              <FileText className="h-5 w-5" />
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="p-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-lg transition-all"
            title="End Teleconsultation"
          >
            <PhoneOff className="h-5 w-5" />
            <span className="hidden sm:inline text-xs">End Call</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge color="success" className="hidden lg:inline-flex">
            ABHA Teleconsult Node Active
          </Badge>
        </div>
      </div>

    </div>
  );
};
