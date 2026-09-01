import React, { useState, useRef } from 'react';
import { Button } from '../../components/Button';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Navigation,
  Compass,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { EmergencyRequestModal, AmbulanceFormData } from '../../components/emergency/EmergencyRequestModal';
import { AmbulanceStatusTracker } from '../../components/emergency/AmbulanceStatusTracker';
import { AmbulanceTrackingCard } from '../../components/emergency/AmbulanceTrackingCard';
import { EmergencyMapVisualization } from '../../components/emergency/EmergencyMapVisualization';
import { NearestHospitals, NearestHospitalItem } from '../../components/emergency/NearestHospitals';
import { EmergencyQuickActions } from '../../components/emergency/EmergencyQuickActions';

export const EmergencyDispatch: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<(AmbulanceFormData & { requestId: string }) | null>({
    requestId: '#AMB-1024',
    patientName: 'Rajesh Kumar',
    mobileNumber: '+91 98160 54321',
    emergencyType: 'Chest Pain / Angina',
    description: 'Acute chest tightness, suspected ischaemic cardiac complication.',
    pickupLocation: 'Dhami Primary Center, Sector 4, Shimla',
  });

  const [locationStatus, setLocationStatus] = useState('Dhami Sector 4, Shimla District');
  const hospitalsRef = useRef<HTMLDivElement>(null);

  const handleRequestSuccess = (data: AmbulanceFormData & { requestId: string }) => {
    setActiveRequest(data);
  };

  const handleScrollToHospitals = () => {
    if (hospitalsRef.current) {
      hospitalsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 page-fade-in">
      
      {/* STEP 2 — HERO DESIGN */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-extrabold uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 animate-pulse text-rose-500" />
              <span>🚨 Emergency Dispatch System</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Emergency Help, <br />
                <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-teal-300 bg-clip-text text-transparent">
                  Just One Tap Away
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Get fast ambulance assistance and emergency support from one simple interface when every second matters.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="danger"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-extrabold text-sm sm:text-base py-3.5 px-6 shadow-xl shadow-red-600/20 border-none flex items-center justify-center gap-2 group"
              >
                <span className="text-xl">🚑</span>
                <span>REQUEST AN AMBULANCE</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleScrollToHospitals}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white font-bold text-sm sm:text-base py-3.5 px-6 flex items-center justify-center gap-2"
              >
                <span className="text-xl">🏥</span>
                <span>FIND NEAREST HOSPITAL</span>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                24/7 National Triage Line Active
              </span>
              <span>•</span>
              <span>Zero Waiting Queue</span>
            </div>
          </div>

          {/* Right Side — CSS Vector Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl relative space-y-6">
              
              {/* Animated Ambulance Icon Graphic */}
              <div className="relative flex justify-center py-4">
                <div className="relative">
                  <span className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping" />
                  <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center text-5xl shadow-2xl border-2 border-rose-400 float-subtle">
                    🚑
                  </div>
                </div>
              </div>

              {/* Quick Status Pill */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Live Dispatch Grid
                </span>
                <p className="text-xs font-medium text-slate-300">
                  Connected to 15,000+ Tier 1-3 Healthcare Units
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-slate-400 text-[10px] block">Avg Response</span>
                  <span className="font-extrabold text-amber-400">10-15 Min</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-slate-400 text-[10px] block">Emergency Line</span>
                  <span className="font-extrabold text-teal-400">Toll Free 108</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STEP 3 — AMBULANCE AVAILABILITY CARD */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl font-bold">
              🚑
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Ambulance Assistance Status
              </h2>
              <p className="text-xs text-slate-500">
                Real-time fleet availability in your medical sector zone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Dispatches Operating Normally
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Available Ambulances</span>
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">03</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Response</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">10–15 min</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Support</span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 block">Available 24/7</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center space-y-1 truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Location</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 block truncate">
              {locationStatus}
            </span>
          </div>
        </div>
      </section>

      {/* STEP 15 — EMERGENCY QUICK ACTIONS */}
      <EmergencyQuickActions
        onRequestAmbulance={() => setIsModalOpen(true)}
        onFindHospital={handleScrollToHospitals}
        onShareLocation={(loc) => setLocationStatus(loc)}
      />

      {/* STEP 10, 11, 12, 13 — ACTIVE AMBULANCE REQUEST CONFIRMATION & TRACKER */}
      {activeRequest && (
        <section className="space-y-6 pt-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  ✅ Ambulance Request Confirmed ({activeRequest.requestId})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your emergency request has been received. An available ambulance is being assigned to your location.
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveRequest(null)}
              className="text-xs shrink-0 self-start sm:self-auto"
            >
              Dismiss / Reset
            </Button>
          </div>

          {/* Status Tracker */}
          <AmbulanceStatusTracker 
            currentStep="on_the_way" 
            requestId={activeRequest.requestId} 
          />

          {/* Grid layout for Map + Tracking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7">
              <EmergencyMapVisualization 
                patientLocation={activeRequest.pickupLocation} 
                ambulanceEta="10 min" 
                distance="2.8 km" 
              />
            </div>

            <div className="lg:col-span-5">
              <AmbulanceTrackingCard 
                ambulanceId="AMB-204"
                eta="10 min"
                distance="2.8 km"
                pickupLocation={activeRequest.pickupLocation}
                onTrackClick={() => alert('Live telemetry locked. Unit AMB-204 is en route.')}
              />
            </div>
          </div>
        </section>
      )}

      {/* STEP 14 — NEAREST HOSPITALS */}
      <div ref={hospitalsRef}>
        <NearestHospitals 
          onSelectHospital={(hosp) => {
            alert(`Directing route to ${hosp.name} (${hosp.distance} away). Contact desk at ${hosp.phone}`);
          }} 
        />
      </div>

      {/* STEP 16 — EMERGENCY CONTACT BANNER */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-extrabold flex items-center justify-center md:justify-start gap-2">
            <PhoneCall className="h-5 w-5 animate-pulse" />
            <span>📞 Need Immediate Assistance?</span>
          </h3>
          <p className="text-xs text-rose-100 max-w-2xl">
            If the situation is life-threatening, contact your local emergency services immediately. National Triage Helpline 108 / 112 connects you directly to the nearest hospital trauma desk.
          </p>
        </div>

        <a 
          href="tel:108"
          className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-slate-100 font-extrabold text-sm shadow-md transition-all shrink-0 flex items-center gap-2 group"
        >
          <PhoneCall className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Call Emergency Services (108 / 112)</span>
        </a>
      </section>

      {/* STEP 4 & 5 — AMBULANCE REQUEST MODAL */}
      <EmergencyRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />

    </div>
  );
};
