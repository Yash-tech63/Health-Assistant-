import React from 'react';
import { MapPin, Navigation, Building2 } from 'lucide-react';

interface MapVisualizationProps {
  patientLocation?: string;
  ambulanceEta?: string;
  distance?: string;
  className?: string;
}

export const EmergencyMapVisualization: React.FC<MapVisualizationProps> = ({
  patientLocation = 'Dhami Village, Sector 4',
  ambulanceEta = '10 min',
  distance = '2.8 km',
  className = '',
}) => {
  return (
    <div className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md ${className}`}>
      {/* Background Map Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.4) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 24px 24px, 24px 24px'
        }}
      />

      {/* SVG Route Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer glow path */}
        <path
          d="M 60,190 C 130,120 220,210 320,130 C 400,75 480,140 560,90"
          fill="none"
          stroke="rgba(239, 68, 68, 0.25)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Animated Dashed Main Route */}
        <path
          d="M 60,190 C 130,120 220,210 320,130 C 400,75 480,140 560,90"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="animate-pulse"
        />

        {/* Pulse Moving Dot along Route */}
        <circle r="5" fill="#f59e0b">
          <animateMotion 
            dur="4s" 
            repeatCount="indefinite" 
            path="M 60,190 C 130,120 220,210 320,130 C 400,75 480,140 560,90" 
          />
        </circle>
      </svg>

      {/* Map Node Pins */}

      {/* 1. Patient Node */}
      <div className="absolute left-[8%] bottom-[20%] z-20 flex flex-col items-center group">
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping" />
          <div className="relative h-9 w-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded bg-slate-800/90 text-[10px] font-bold text-rose-300 border border-rose-500/30 backdrop-blur-xs whitespace-nowrap">
          📍 Patient Location
        </div>
      </div>

      {/* 2. Moving Ambulance Node */}
      <div className="absolute left-[48%] top-[38%] z-20 flex flex-col items-center">
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
          <div className="relative h-10 w-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white transform hover:scale-110 transition-transform">
            <Navigation className="h-5 w-5 animate-pulse" />
          </div>
        </div>
        <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/40 backdrop-blur-xs flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
          Ambulance AMB-204 ({ambulanceEta})
        </div>
      </div>

      {/* 3. Hospital Node */}
      <div className="absolute right-[8%] top-[20%] z-20 flex flex-col items-center">
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-1.5 px-2 py-0.5 rounded bg-slate-800/90 text-[10px] font-bold text-teal-300 border border-teal-500/30 backdrop-blur-xs whitespace-nowrap">
          🏥 District Hospital Emergency
        </div>
      </div>

      {/* Map Overlay Stats Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-200 flex items-center gap-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Route Dispatch</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-amber-400">
            ETA: {ambulanceEta}
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-teal-400">
            Dist: {distance}
          </div>
        </div>
      </div>

      {/* Location label bottom bar */}
      <div className="absolute bottom-3 left-3 right-3 z-30 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
        <span className="truncate">📍 Pickup: <strong className="text-white">{patientLocation}</strong></span>
        <span className="text-emerald-400 font-semibold shrink-0 ml-2">GPS Connected</span>
      </div>
    </div>
  );
};
