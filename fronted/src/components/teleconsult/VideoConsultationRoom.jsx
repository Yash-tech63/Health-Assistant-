import React, { useState, useEffect, useRef } from 'react';

import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MessageSquare,
  PhoneOff,
  Heart,
  Activity,
  Thermometer,
  ShieldCheck,
  X,
  Send,
  FileText,
  CheckCircle,
  UserRound,
} from 'lucide-react';

import { Button } from '../Button';
import { Badge } from '../Badge';


export const VideoConsultationRoom = ({
  doctorName,
  doctorSpecialty,
  doctorFacility,
  patientName,
  abhaId,
  userRole,
  onEndCall,
  mediaStream,
}) => {

  // ==========================================
  // VIDEO REFERENCES
  // ==========================================

  const mainVideoRef = useRef(null);
  const selfVideoRef = useRef(null);


  // ==========================================
  // MEDIA CONTROLS STATE
  // ==========================================

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [prescOpen, setPrescOpen] = useState(false);


  // ==========================================
  // CALL TIMER
  // ==========================================

  const [callSeconds, setCallSeconds] = useState(0);


  // ==========================================
  // LIVE CHAT
  // ==========================================

  const [messages, setMessages] = useState([
    {
      sender: doctorName,
      text: 'Namaste! Can you hear and see me clearly?',
      time: '10:15 AM',
    },
    {
      sender: patientName,
      text: 'Namaste Doctor, yes audio and video are crisp.',
      time: '10:15 AM',
    },
  ]);

  const [chatInput, setChatInput] = useState('');


  // ==========================================
  // VITALS
  // ==========================================

  const [vitals, setVitals] = useState({
    heartRate: 72,
    bp: '120/80',
    spO2: 98,
    temp: 98.6,
  });


  // ==========================================
  // ATTACH LIVE CAMERA STREAM
  // ==========================================

  useEffect(() => {

    if (!mediaStream) {
      return;
    }


    const attachStream = async (videoElement) => {

      if (!videoElement) {
        return;
      }

      try {

        videoElement.srcObject = mediaStream;

        await videoElement.play();

      } catch (error) {

        console.error(
          'VIDEO PLAYBACK ERROR:',
          error
        );

      }

    };


    // Main camera screen

    attachStream(
      mainVideoRef.current
    );


    // Small picture in picture camera

    attachStream(
      selfVideoRef.current
    );


  }, [mediaStream]);


  // ==========================================
  // CALL TIMER + VITALS
  // ==========================================

  useEffect(() => {

    const timer = setInterval(() => {

      setCallSeconds((prev) => prev + 1);

    }, 1000);


    const vitalsInterval = setInterval(() => {

      setVitals((prev) => ({

        ...prev,

        heartRate:
          70 + Math.floor(Math.random() * 5),

        spO2:
          97 + Math.floor(Math.random() * 3),

      }));

    }, 4000);


    return () => {

      clearInterval(timer);

      clearInterval(vitalsInterval);

    };

  }, []);


  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formatTimer = (seconds) => {

    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;


    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;

  };


  // ==========================================
  // SEND CHAT MESSAGE
  // ==========================================

  const handleSendMessage = (e) => {

    e.preventDefault();


    if (!chatInput.trim()) {

      return;

    }


    const myName =
      userRole === 'patient'
        ? patientName
        : doctorName;


    setMessages((prev) => [

      ...prev,

      {

        sender: myName,

        text:
          chatInput.trim(),

        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          ),

      },

    ]);


    setChatInput('');

  };


  // ==========================================
  // PRESCRIPTION
  // ==========================================

  const [prescNotes, setPrescNotes] =
    useState('');

  const [prescSuccess, setPrescSuccess] =
    useState(false);


  const handleIssuePrescription = (e) => {

    e.preventDefault();


    setPrescSuccess(
      true
    );


    setTimeout(() => {

      setPrescSuccess(
        false
      );

      setPrescOpen(
        false
      );

    }, 2000);

  };


  // ==========================================
  // TOGGLE MICROPHONE
  // ==========================================

  const toggleMicrophone = () => {

    if (!mediaStream) {

      setMicActive(
        (prev) => !prev
      );

      return;

    }


    const newState =
      !micActive;


    mediaStream
      .getAudioTracks()
      .forEach((track) => {

        track.enabled =
          newState;

      });


    setMicActive(
      newState
    );

  };


  // ==========================================
  // TOGGLE CAMERA
  // ==========================================

  const toggleCamera = () => {

    if (!mediaStream) {

      setCameraActive(
        (prev) => !prev
      );

      return;

    }


    const newState =
      !cameraActive;


    mediaStream
      .getVideoTracks()
      .forEach((track) => {

        track.enabled =
          newState;

      });


    setCameraActive(
      newState
    );

  };


  // ==========================================
  // END CALL
  // ==========================================

  const handleEndVideoCall = () => {

    if (mediaStream) {

      mediaStream
        .getTracks()
        .forEach((track) => {

          track.stop();

        });

    }


    if (onEndCall) {

      onEndCall();

    }

  };


  // ==========================================
  // PEER NAME
  // ==========================================

  const peerName =
    userRole === 'patient'
      ? doctorName
      : patientName;


  return (

    <div className="relative w-full h-[calc(100vh-6rem)] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">


      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20">


        <div className="flex items-center gap-3">


          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />


          <div>

            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">

              <span>

                {peerName}

              </span>


              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">

                LIVE HD

              </span>

            </h3>


            <p className="text-[10px] text-slate-400">

              {userRole === 'patient'

                ? `${doctorSpecialty} • ${doctorFacility}`

                : `ABHA #${abhaId} • ${patientName}`

              }

            </p>

          </div>

        </div>


        <div className="flex items-center gap-3">


          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 font-mono">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span>

              {formatTimer(callSeconds)}

            </span>

          </div>


          <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 font-medium">

            <ShieldCheck className="h-3 w-3" />

            <span className="hidden sm:inline">

              ABDM Encrypted

            </span>

          </div>

        </div>

      </div>


      {/* ====================================== */}
      {/* MAIN LIVE VIDEO */}
      {/* ====================================== */}

      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">


        {/* ==================================== */}
        {/* REAL LIVE CAMERA */}
        {/* ==================================== */}

        {cameraActive && mediaStream ? (

          <video

            ref={mainVideoRef}

            autoPlay

            playsInline

            muted

            className="absolute inset-0 w-full h-full object-cover bg-black scale-x-[-1]"

          />

        ) : (

          <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">

            <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center">

              <VideoOff className="h-10 w-10" />

            </div>


            <p className="text-sm font-medium">

              {cameraActive
                ? 'Camera is loading...'
                : 'Camera turned off'
              }

            </p>

          </div>

        )}


        {/* ==================================== */}
        {/* GRADIENT OVERLAY */}
        {/* ==================================== */}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />


        {/* ==================================== */}
        {/* VITALS */}
        {/* ==================================== */}

        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 text-white space-y-2 z-10 shadow-lg max-w-xs">

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">

            Real-time Vitals Telemetry

          </span>


          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">


            <div className="flex items-center gap-1.5">

              <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse" />

              <div>

                <span className="text-[9px] text-slate-400 block">

                  Pulse

                </span>

                <strong className="text-white font-mono">

                  {vitals.heartRate} bpm

                </strong>

              </div>

            </div>


            <div className="flex items-center gap-1.5">

              <Activity className="h-3.5 w-3.5 text-emerald-400" />

              <div>

                <span className="text-[9px] text-slate-400 block">

                  BP

                </span>

                <strong className="text-white font-mono">

                  {vitals.bp}

                </strong>

              </div>

            </div>


            <div className="flex items-center gap-1.5">

              <span className="text-sky-400 font-bold text-xs">

                O₂

              </span>

              <div>

                <span className="text-[9px] text-slate-400 block">

                  SpO₂

                </span>

                <strong className="text-white font-mono">

                  {vitals.spO2}%

                </strong>

              </div>

            </div>


            <div className="flex items-center gap-1.5">

              <Thermometer className="h-3.5 w-3.5 text-amber-400" />

              <div>

                <span className="text-[9px] text-slate-400 block">

                  Temp

                </span>

                <strong className="text-white font-mono">

                  {vitals.temp}°F

                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================== */}
        {/* SELF CAMERA PREVIEW */}
        {/* ==================================== */}

        <div className="absolute bottom-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 z-10">


          {cameraActive && mediaStream ? (

            <video

              ref={selfVideoRef}

              autoPlay

              playsInline

              muted

              className="w-full h-full object-cover scale-x-[-1]"

            />

          ) : (

            <div className="w-full h-full flex items-center justify-center">

              <UserRound className="h-10 w-10 text-slate-500" />

            </div>

          )}


          <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] text-slate-200 font-bold">

            You ({userRole?.toUpperCase()})

          </div>

        </div>


        {/* ==================================== */}
        {/* CHAT DRAWER */}
        {/* ==================================== */}

        {chatOpen && (

          <div className="absolute top-0 right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-lg border-l border-slate-800 p-4 flex flex-col z-20 shadow-2xl">


            <div className="flex justify-between items-center pb-3 border-b border-slate-800">

              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">

                <MessageSquare className="h-4 w-4 text-emerald-400" />

                In-Call Live Chat

              </h4>


              <button

                onClick={() => setChatOpen(false)}

                className="text-slate-400 hover:text-white"

              >

                <X className="h-4 w-4" />

              </button>

            </div>


            <div className="flex-1 overflow-y-auto py-3 space-y-3">

              {messages.map((msg, idx) => (

                <div

                  key={idx}

                  className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/50 space-y-1"

                >

                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">

                    <span>

                      {msg.sender}

                    </span>

                    <span>

                      {msg.time}

                    </span>

                  </div>


                  <p className="text-xs text-slate-200">

                    {msg.text}

                  </p>

                </div>

              ))}

            </div>


            <form

              onSubmit={handleSendMessage}

              className="pt-2 border-t border-slate-800 flex gap-2"

            >

              <input

                type="text"

                value={chatInput}

                onChange={(e) =>
                  setChatInput(e.target.value)
                }

                placeholder="Type a message..."

                className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 outline-none focus:border-emerald-500"

              />


              <button

                type="submit"

                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"

              >

                <Send className="h-4 w-4" />

              </button>

            </form>

          </div>

        )}


        {/* ==================================== */}
        {/* PRESCRIPTION DRAWER */}
        {/* ==================================== */}

        {prescOpen && userRole === 'doctor' && (

          <div className="absolute top-0 left-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-lg border-r border-slate-800 p-4 flex flex-col z-20 shadow-2xl">


            <div className="flex justify-between items-center pb-3 border-b border-slate-800">

              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">

                <FileText className="h-4 w-4 text-emerald-400" />

                Write Live E-Prescription

              </h4>


              <button

                onClick={() =>
                  setPrescOpen(false)
                }

                className="text-slate-400 hover:text-white"

              >

                <X className="h-4 w-4" />

              </button>

            </div>


            <form

              onSubmit={handleIssuePrescription}

              className="flex-1 flex flex-col justify-between py-3 space-y-4"

            >

              <div className="space-y-3 text-xs text-slate-300">

                <div>

                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">

                    Patient ABHA Profile

                  </label>


                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">

                    <p className="font-bold text-white">

                      {patientName}

                    </p>


                    <p className="text-[10px] text-slate-400 font-mono">

                      ABHA #{abhaId}

                    </p>

                  </div>

                </div>


                <div>

                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">

                    Clinical Notes & Rx

                  </label>


                  <textarea

                    rows={4}

                    value={prescNotes}

                    onChange={(e) =>
                      setPrescNotes(e.target.value)
                    }

                    placeholder="Enter prescription..."

                    className="w-full bg-slate-800 text-white text-xs rounded-xl p-3 border border-slate-700 outline-none focus:border-emerald-500 resize-none"

                  />

                </div>

              </div>


              {prescSuccess ? (

                <div className="bg-emerald-950 text-emerald-300 p-3 rounded-xl border border-emerald-800 flex items-center gap-2 text-xs font-bold">

                  <CheckCircle className="h-5 w-5 text-emerald-400" />

                  <span>

                    E-Prescription signed successfully!

                  </span>

                </div>

              ) : (

                <Button

                  type="submit"

                  variant="primary"

                  className="w-full"

                >

                  Sign & Issue E-Prescription

                </Button>

              )}

            </form>

          </div>

        )}

      </div>


      {/* ====================================== */}
      {/* BOTTOM CONTROLS */}
      {/* ====================================== */}

      <div className="h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 flex items-center justify-between z-20">


        <div className="flex items-center gap-2 text-xs text-slate-400">

          <span className="hidden sm:inline font-mono">

            Session ID: #TC-8273-HP

          </span>

        </div>


        <div className="flex items-center gap-3">


          {/* MICROPHONE */}

          <button

            onClick={toggleMicrophone}

            className={`p-3.5 rounded-2xl border transition-all ${micActive
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-rose-600 border-rose-500 text-white'
              }`}

          >

            {micActive ? (

              <Mic className="h-5 w-5" />

            ) : (

              <MicOff className="h-5 w-5" />

            )}

          </button>


          {/* CAMERA */}

          <button

            onClick={toggleCamera}

            className={`p-3.5 rounded-2xl border transition-all ${cameraActive
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-rose-600 border-rose-500 text-white'
              }`}

          >

            {cameraActive ? (

              <VideoIcon className="h-5 w-5" />

            ) : (

              <VideoOff className="h-5 w-5" />

            )}

          </button>


          {/* SCREEN SHARE */}

          <button

            onClick={() =>
              setScreenSharing(!screenSharing)
            }

            className={`p-3.5 rounded-2xl border transition-all hidden sm:flex ${screenSharing
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              }`}

          >

            <Monitor className="h-5 w-5" />

          </button>


          {/* CHAT */}

          <button

            onClick={() =>
              setChatOpen(!chatOpen)
            }

            className={`p-3.5 rounded-2xl border transition-all relative ${chatOpen
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
              }`}

          >

            <MessageSquare className="h-5 w-5" />

            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-900" />

          </button>


          {/* PRESCRIPTION */}

          {userRole === 'doctor' && (

            <button

              onClick={() =>
                setPrescOpen(!prescOpen)
              }

              className="p-3.5 rounded-2xl border bg-slate-800 border-slate-700 text-white"

            >

              <FileText className="h-5 w-5" />

            </button>

          )}


          {/* END CALL */}

          <button

            onClick={handleEndVideoCall}

            className="p-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-lg transition-all"

          >

            <PhoneOff className="h-5 w-5" />

            <span className="hidden sm:inline text-xs">

              End Call

            </span>

          </button>

        </div>


        <div className="flex items-center gap-2">

          <Badge
            color="success"
            className="hidden lg:inline-flex"
          >

            ABHA Teleconsult Node Active

          </Badge>

        </div>

      </div>

    </div>

  );

};