import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity, Film } from 'lucide-react';
import { Modal } from '../Modal';
import { Badge } from '../Badge';
export const treatmentVideosList = [
    {
        id: 'VID-01',
        title: 'Primary PHC Consultation & ECG Examination',
        category: 'PHC Care',
        duration: '02:45',
        description: 'Detailed demonstration of how a rural Medical Officer examines patient chest symptoms, records digital ECG, and initiates ABHA health card telemetry.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-examining-a-patient-42861-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop',
        steps: [
            { step: 1, title: 'Symptom Review & ABHA Lookup', desc: 'Doctor scans ABHA ID #91-8273 and checks patient cardiac history.' },
            { step: 2, title: 'Clinical Examination & Vitals Check', desc: 'Blood pressure, pulse, SpO2, and lung auscultation conducted.' },
            { step: 3, title: 'Digital 12-Lead ECG Acquisition', desc: 'ECG leads placed; telemetry transmitted to District Referral Hub.' }
        ]
    },
    {
        id: 'VID-02',
        title: 'District Hospital Teleconsultation & 2D Echo',
        category: 'District Teleconsult',
        duration: '03:12',
        description: 'Watch Senior Cardiologist Dr. Arvind Sharma conduct a live HD video consultation with rural PHC patient and review 2D Echocardiogram results.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-consulting-with-a-patient-in-an-office-42858-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
        steps: [
            { step: 1, title: 'HD Teleconsult Connection', desc: 'Doctor and PHC health officer open ABDM encrypted video link.' },
            { step: 2, title: 'Live Echocardiography Telemetry', desc: 'Ultrasound probe scans LVEF EF% and hypokinesia wall motion.' },
            { step: 3, title: 'Referral Ticket Escalation', desc: 'Doctor signs digital referral to IGMC Tertiary Cath Lab.' }
        ]
    },
    {
        id: 'VID-03',
        title: 'Cath Lab Coronary Angiography Procedure',
        category: 'Cath Lab Specialist',
        duration: '04:05',
        description: '3D & video walkthrough of interventional cardiologist Dr. Vikram Sen performing coronary angiography in the IGMC Specialist Hospital Cath Lab.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-surgeons-performing-an-operation-in-an-operating-room-41544-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
        steps: [
            { step: 1, title: 'Radial Artery Access & Sheath Placement', desc: 'Local anaesthesia administered; 6F radial sheath inserted.' },
            { step: 2, title: 'Contrast Fluoroscopy Imaging', desc: 'Coronary catheters visualize left anterior descending artery.' },
            { step: 3, title: 'Stent Deployment & Recovery', desc: 'Drug-eluting stent deployed; patient transferred to Cardiac Care Unit.' }
        ]
    },
    {
        id: 'VID-04',
        title: 'Emergency 108 Ambulance Airway & CPR Protocol',
        category: 'Emergency 108',
        duration: '02:18',
        description: 'Paramedic team responding to rural 108 call, administering bag-valve-mask oxygenation, and stabilizing cardiac rhythm en-route to trauma center.',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-paramedics-taking-a-patient-to-the-ambulance-42863-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=1000&auto=format&fit=crop',
        steps: [
            { step: 1, title: 'Rapid Scene Response & Triage', desc: '108 Paramedics arrive at Dhami Village with ALS resuscitation kit.' },
            { step: 2, title: 'High-Flow Oxygen & Cardiac Defibrillation', desc: 'AED rhythm analyzed; 100% O2 administered.' },
            { step: 3, title: 'Hospital Notification & Transit', desc: 'Trauma team pre-notified via ABDM dispatch node.' }
        ]
    }
];
export const TreatmentVideoModal = ({ isOpen, onClose, }) => {
    const selectedId = initialVideoId || 'VID-01';
    const [activeVideo, setActiveVideo] = useState(treatmentVideosList.find(v => v.id === selectedId) || treatmentVideosList[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef(null);
    const togglePlay = () => {
        if (!videoRef.current)
            return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
        else {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true));
        }
    };
    const toggleMute = () => {
        if (!videoRef.current)
            return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title="3D & Video Medical Treatment Demonstration" size="lg">
      <div className="space-y-6">
        
        {/* Video Player Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video group">
          {!videoError ? (<video ref={videoRef} src={activeVideo.videoUrl} poster={activeVideo.posterUrl} className="w-full h-full object-cover" onEnded={() => setIsPlaying(false)} onError={() => setVideoError(true)}/>) : (<div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <img src={activeVideo.posterUrl} alt={activeVideo.title} className="absolute inset-0 w-full h-full object-cover opacity-30"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"/>
              
              <div className="relative z-10 space-y-2 max-w-md">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <Activity className="h-8 w-8 animate-pulse"/>
                </div>
                <h4 className="font-extrabold text-sm text-white">Interactive 3D Procedural Simulation Mode</h4>
                <p className="text-xs text-slate-300">
                  {activeVideo.description}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Badge color="success">3D Simulation Active</Badge>
                  <Badge color="primary">Step-by-Step Clinical Protocol</Badge>
                </div>
              </div>
            </div>)}

          {/* Video Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none"/>

          {/* Top Title Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Badge color="primary" className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-xs">
              <Film className="h-3.5 w-3.5 mr-1"/>
              {activeVideo.category}
            </Badge>
            <span className="text-xs text-white font-mono bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
              Duration: {activeVideo.duration}
            </span>
          </div>

          {/* Big Play Button Overlay */}
          {!isPlaying && (<button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-slate-950/40 hover:bg-slate-950/20 transition-all z-10">
              <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="h-8 w-8 fill-white ml-1"/>
              </div>
            </button>)}

          {/* Bottom Control Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-emerald-600 transition-colors border border-slate-700">
                {isPlaying ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4 fill-white"/>}
              </button>
              <button onClick={toggleMute} className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-emerald-600 transition-colors border border-slate-700">
                {isMuted ? <VolumeX className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
              </button>
            </div>

            <span className="text-xs text-white font-bold hidden sm:block">
              {activeVideo.title}
            </span>
          </div>
        </div>

        {/* Video Description & Step-by-Step Clinical Transcript */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{activeVideo.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeVideo.description}</p>
          </div>

          {/* Clinical Steps Timeline */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600"/>
              Step-by-Step Treatment Procedure Workflow
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activeVideo.steps.map(s => (<div key={s.step} className="p-3 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px]">
                      {s.step}
                    </span>
                    <span>{s.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{s.desc}</p>
                </div>))}
            </div>
          </div>

          {/* Playlist selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Other Treatment Demonstrations</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {treatmentVideosList.map(v => (<button key={v.id} onClick={() => {
                setActiveVideo(v);
                setIsPlaying(false);
            }} className={`p-2.5 rounded-xl border text-left text-xs transition-all ${activeVideo.id === v.id
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-700 dark:text-slate-300'}`}>
                  <p className="font-bold truncate text-[11px]">{v.title}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{v.category}</span>
                </button>))}
            </div>
          </div>
        </div>

      </div>
    </Modal>);
};
