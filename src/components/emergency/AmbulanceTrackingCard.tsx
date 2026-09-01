import React from 'react';
import { Navigation, Phone, MapPin, ShieldAlert, User, Compass } from 'lucide-react';
import { Button } from '../Button';

interface AmbulanceTrackingCardProps {
  ambulanceId?: string;
  eta?: string;
  distance?: string;
  driverName?: string;
  driverPhone?: string;
  pickupLocation?: string;
  onTrackClick?: () => void;
  className?: string;
}

export const AmbulanceTrackingCard: React.FC<AmbulanceTrackingCardProps> = ({
  ambulanceId = 'AMB-204',
  eta = '10 min',
  distance = '2.8 km',
  driverName = 'Vikram Singh (Certified Paramedic)',
  driverPhone = '+91 98160 11223',
  pickupLocation = 'Dhami Village, Sector 4',
  onTrackClick,
  className = '',
}) => {
  return (
    <div className={`p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden ${className}`}>
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            🚑
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Assigned Emergency Unit
            </span>
            <h3 className="text-lg font-extrabold text-white">
              Unit {ambulanceId}
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          En Route
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 text-center">
        <div>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Estimated ETA</span>
          <span className="text-xl font-extrabold text-amber-400">{eta}</span>
        </div>

        <div className="border-x border-slate-800">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Distance</span>
          <span className="text-xl font-extrabold text-teal-400">{distance}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Unit Status</span>
          <span className="text-xs font-bold text-emerald-400 mt-1 block truncate">On The Way</span>
        </div>
      </div>

      {/* Driver & Pickup details */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] block">Dispatched Driver</span>
              <strong className="text-slate-200">{driverName}</strong>
            </div>
          </div>
          <a 
            href={`tel:${driverPhone}`}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call Driver</span>
          </a>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-400 text-[10px] block">Target Pickup Location</span>
            <span className="text-slate-200 font-medium">{pickupLocation}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Button 
          variant="primary" 
          onClick={onTrackClick}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold border-none shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
        >
          <Compass className="h-4 w-4" />
          <span>📍 Track Ambulance Live</span>
        </Button>
      </div>

      <p className="text-[10px] text-slate-400 italic text-center">
        ℹ️ Standardized mock dispatch interface. Live telemetry syncs automatically upon driver arrival.
      </p>
    </div>
  );
};
