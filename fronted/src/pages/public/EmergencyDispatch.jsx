import React, { useState, useRef } from 'react';
import { Button } from '../../components/Button';
import { 
  ShieldAlert, PhoneCall, CheckCircle2, ArrowRight, Wind, 
  Droplet, Activity, AlertTriangle, MapPin, X, Heart, Clock, Search
} from 'lucide-react';
import { EmergencyRequestModal } from '../../components/emergency/EmergencyRequestModal';
import { AmbulanceStatusTracker } from '../../components/emergency/AmbulanceStatusTracker';
import { AmbulanceTrackingCard } from '../../components/emergency/AmbulanceTrackingCard';
import { EmergencyMapVisualization } from '../../components/emergency/EmergencyMapVisualization';
import { NearestHospitals } from '../../components/emergency/NearestHospitals';
import { EmergencyQuickActions } from '../../components/emergency/EmergencyQuickActions';

export const EmergencyDispatch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oxygenModalOpen, setOxygenModalOpen] = useState(false);
    const [bloodModalOpen, setBloodModalOpen] = useState(false);
    const [donorModalOpen, setDonorModalOpen] = useState(false);

    // Active requests state
    const [activeRequest, setActiveRequest] = useState({
        requestId: '#AMB-1024',
        patientName: 'Rajesh Kumar',
        mobileNumber: '+91 98160 54321',
        emergencyType: 'Chest Pain / Angina',
        description: 'Acute chest tightness, suspected ischaemic cardiac complication.',
        pickupLocation: 'Dhami Primary Center, Sector 4, Shimla',
    });

    const [locationStatus, setLocationStatus] = useState('Dhami Sector 4, Shimla District');
    const [alertNotification, setAlertNotification] = useState('');

    // Oxygen request state
    const [oxygenFormData, setOxygenFormData] = useState({
        patientName: '',
        cylinderType: 'B-Type 10L Portable Oxygen',
        spO2Level: '82%',
        location: 'Dhami Sector 4, Shimla',
        contactPhone: ''
    });

    // Blood request state
    const [bloodFormData, setBloodFormData] = useState({
        patientName: '',
        bloodGroup: 'O-',
        unitsNeeded: '2',
        hospitalName: 'Shimla District Hospital',
        contactPhone: ''
    });

    const hospitalsRef = useRef(null);

    // Mock Blood Stock Matrix
    const bloodStockData = [
        { group: 'O-', units: 14, status: 'Critical Supply', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
        { group: 'O+', units: 48, status: 'Available', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
        { group: 'A+', units: 36, status: 'Available', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
        { group: 'A-', units: 8, status: 'Low Stock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
        { group: 'B+', units: 52, status: 'Available', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
        { group: 'B-', units: 11, status: 'Low Stock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
        { group: 'AB+', units: 29, status: 'Available', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
        { group: 'AB-', units: 5, status: 'Critical Supply', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
    ];

    // Mock Oxygen Depots
    const oxygenDepots = [
        { name: 'Central Hospital Oxygen Depot', cylinders: '85 Units (10L & 47L)', distance: '1.2 km', eta: '8 mins' },
        { name: 'Red Cross Emergency Oxygen Hub', cylinders: '42 Units (D-Type)', distance: '2.5 km', eta: '12 mins' },
        { name: 'District Medical Oxygen Reserve', concentrators: '18 Concentrators (10L/min)', distance: '3.8 km', eta: '15 mins' },
    ];

    const handleRequestSuccess = (data) => {
        setActiveRequest(data);
    };

    const handleScrollToHospitals = () => {
        if (hospitalsRef.current) {
            hospitalsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleOxygenSubmit = (e) => {
        e.preventDefault();
        setAlertNotification(`🚨 EMERGENCY OXYGEN DISPATCHED: ${oxygenFormData.cylinderType} is en route to ${oxygenFormData.location}. Driver contact sent via SMS.`);
        setOxygenModalOpen(false);
        setTimeout(() => setAlertNotification(''), 7000);
    };

    const handleBloodSubmit = (e) => {
        e.preventDefault();
        setAlertNotification(`🩸 URGENT BLOOD MATCH FOUND: ${bloodFormData.unitsNeeded} Unit(s) of ${bloodFormData.bloodGroup} reserved at Regional Blood Depot for ${bloodFormData.patientName}. Hospital notified.`);
        setBloodModalOpen(false);
        setTimeout(() => setAlertNotification(''), 7000);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 page-fade-in">
        
        {/* HERO SECTION */}
        <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-extrabold uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4 animate-pulse text-rose-500"/>
                <span>🚨 Emergency Rapid Response System</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Emergency Help & <br />
                  <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-teal-300 bg-clip-text text-transparent">
                    Critical Life Support
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Instant SOS dispatches for Ambulances, Medical Oxygen Cylinders, Emergency Blood Bank Matching, and ICU Beds.
                </p>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  variant="danger" 
                  size="lg" 
                  onClick={() => setIsModalOpen(true)} 
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-extrabold text-sm sm:text-base py-3.5 px-6 shadow-xl shadow-red-600/20 border-none flex items-center justify-center gap-2 group"
                >
                  <span className="text-xl">🚑</span>
                  <span>REQUEST AMBULANCE</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                </Button>

                <button 
                  onClick={() => setOxygenModalOpen(true)} 
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Wind className="h-4 w-4 text-sky-200" />
                  <span>EMERGENCY OXYGEN (SOS)</span>
                </button>

                <button 
                  onClick={() => setBloodModalOpen(true)} 
                  className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Droplet className="h-4 w-4 text-rose-200" />
                  <span>URGENT BLOOD REQUEST</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"/>
                  24/7 Triage & Oxygen Command Active
                </span>
                <span>•</span>
                <span>Priority Dispatch</span>
              </div>
            </div>

            {/* Right Side Visual Grid */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl relative space-y-5">
                
                <div className="relative flex justify-center py-2">
                  <div className="relative flex gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-3xl shadow-xl border border-rose-400">
                      🚑
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-3xl shadow-xl border border-sky-400">
                      💨
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-red-700 text-white flex items-center justify-center text-3xl shadow-xl border border-red-400">
                      🩸
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Emergency Triage Network
                  </span>
                  <p className="text-xs font-medium text-slate-300">
                    Connected to 15,000+ Ambulances, Blood Depots & Oxygen Hubs
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 text-[9px] block">Ambulance</span>
                    <span className="font-extrabold text-rose-400 text-xs">10-15 Min</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 text-[9px] block">Oxygen Depots</span>
                    <span className="font-extrabold text-sky-400 text-xs">145 Units</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 text-[9px] block">Blood Depots</span>
                    <span className="font-extrabold text-amber-400 text-xs">24/7 Match</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* NOTIFICATION BANNER */}
        {alertNotification && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>{alertNotification}</span>
            </div>
            <button onClick={() => setAlertNotification('')} className="text-amber-700 dark:text-amber-400 hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 🌟 NEW FEATURE SECTION 1: EMERGENCY OXYGEN CYLINDER SUPPLY & DISPATCH */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center text-2xl font-bold">
                💨
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Emergency Oxygen Cylinder Reserve</span>
                  <span className="text-xs bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 rounded-full font-bold">
                    Fast SOS Delivery
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time stock monitoring and immediate doorstep delivery of medical oxygen cylinders & concentrators.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setOxygenModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              + Request Oxygen Cylinder
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {oxygenDepots.map((depot, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                    {depot.name}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    {depot.eta} ETA
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-350">
                  <p>📦 <strong>Stock:</strong> {depot.cylinders || depot.concentrators}</p>
                  <p>📍 <strong>Distance:</strong> {depot.distance} from your location</p>
                </div>
                <button
                  onClick={() => {
                    setOxygenFormData(prev => ({ ...prev, location: depot.name }));
                    setOxygenModalOpen(true);
                  }}
                  className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all text-center"
                >
                  Dispatch from this Depot
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 🌟 NEW FEATURE SECTION 2: URGENT BLOOD BANK & DONOR MATCHER ("NEEDS OF BLOOD") */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl font-bold">
                🩸
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Urgent Blood Need & Donor Network</span>
                  <span className="text-xs bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                    24/7 Matcher
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Live regional blood stock levels and instant donor SOS broadcast for critical surgeries & emergencies.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                onClick={() => setBloodModalOpen(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
              >
                + Request Blood (SOS)
              </Button>
              <Button
                variant="outline"
                onClick={() => setDonorModalOpen(true)}
                className="text-xs font-bold px-4 py-2.5 rounded-xl border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
              >
                Become Blood Donor
              </Button>
            </div>
          </div>

          {/* Blood Stock Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {bloodStockData.map((item) => (
              <div
                key={item.group}
                onClick={() => {
                  setBloodFormData(prev => ({ ...prev, bloodGroup: item.group }));
                  setBloodModalOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 hover:border-rose-400 cursor-pointer transition-all group"
              >
                <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 block group-hover:scale-110 transition-transform">
                  {item.group}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {item.units} Units
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AMBULANCE FLEET STATUS */}
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
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"/>
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

        {/* EMERGENCY QUICK ACTIONS */}
        <EmergencyQuickActions 
          onRequestAmbulance={() => setIsModalOpen(true)} 
          onFindHospital={handleScrollToHospitals} 
          onShareLocation={(loc) => setLocationStatus(loc)}
        />

        {/* ACTIVE REQUEST TRACKER */}
        {activeRequest && (
          <section className="space-y-6 pt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0"/>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    ✅ Ambulance Request Confirmed ({activeRequest.requestId})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your emergency request has been received. An available ambulance is being assigned to your location.
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => setActiveRequest(null)} className="text-xs shrink-0 self-start sm:self-auto">
                Dismiss / Reset
              </Button>
            </div>

            <AmbulanceStatusTracker currentStep="on_the_way" requestId={activeRequest.requestId}/>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7">
                <EmergencyMapVisualization patientLocation={activeRequest.pickupLocation} ambulanceEta="10 min" distance="2.8 km"/>
              </div>

              <div className="lg:col-span-5">
                <AmbulanceTrackingCard ambulanceId="AMB-204" eta="10 min" distance="2.8 km" pickupLocation={activeRequest.pickupLocation} onTrackClick={() => alert('Live telemetry locked. Unit AMB-204 is en route.')}/>
              </div>
            </div>
          </section>
        )}

        {/* NEAREST HOSPITALS */}
        <div ref={hospitalsRef}>
          <NearestHospitals onSelectHospital={(hosp) => {
              alert(`Directing route to ${hosp.name} (${hosp.distance} away). Contact desk at ${hosp.phone}`);
          }}/>
        </div>

        {/* EMERGENCY TOLL-FREE BANNER */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-extrabold flex items-center justify-center md:justify-start gap-2">
              <PhoneCall className="h-5 w-5 animate-pulse"/>
              <span>📞 Need Immediate National Emergency Support?</span>
            </h3>
            <p className="text-xs text-rose-100 max-w-2xl">
              National Triage Helpline 108 / 112 connects you directly to nearest ambulances, blood banks, and critical oxygen command centers.
            </p>
          </div>

          <a href="tel:108" className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-slate-100 font-extrabold text-sm shadow-md transition-all shrink-0 flex items-center gap-2 group">
            <PhoneCall className="h-4 w-4 group-hover:scale-110 transition-transform"/>
            <span>Call Emergency Hotline (108 / 112)</span>
          </a>
        </section>

        {/* MODAL 1: AMBULANCE REQUEST MODAL */}
        <EmergencyRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleRequestSuccess}/>

        {/* MODAL 2: EMERGENCY OXYGEN CYLINDER MODAL */}
        {oxygenModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-sky-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Emergency Oxygen Cylinder Request (SOS)
                  </h3>
                </div>
                <button onClick={() => setOxygenModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleOxygenSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient name"
                    value={oxygenFormData.patientName}
                    onChange={(e) => setOxygenFormData({ ...oxygenFormData, patientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cylinder / Concentrator Type</label>
                  <select
                    value={oxygenFormData.cylinderType}
                    onChange={(e) => setOxygenFormData({ ...oxygenFormData, cylinderType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option>B-Type 10L Portable Oxygen Cylinder</option>
                    <option>D-Type 47L Medical Oxygen Cylinder</option>
                    <option>Oxygen Concentrator (10 Liters/min)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Patient SpO2 Level (%)</label>
                    <input
                      type="text"
                      placeholder="e.g. 82%"
                      value={oxygenFormData.spO2Level}
                      onChange={(e) => setOxygenFormData({ ...oxygenFormData, spO2Level: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={oxygenFormData.contactPhone}
                      onChange={(e) => setOxygenFormData({ ...oxygenFormData, contactPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Address / Hospital Ward</label>
                  <input
                    type="text"
                    required
                    value={oxygenFormData.location}
                    onChange={(e) => setOxygenFormData({ ...oxygenFormData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3 text-xs"
                >
                  🚀 Dispatch Emergency Oxygen Now
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: URGENT BLOOD NEED MODAL */}
        {bloodModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-rose-600" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Urgent Blood Request SOS
                  </h3>
                </div>
                <button onClick={() => setBloodModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleBloodSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient name"
                    value={bloodFormData.patientName}
                    onChange={(e) => setBloodFormData({ ...bloodFormData, patientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Required Blood Group</label>
                    <select
                      value={bloodFormData.bloodGroup}
                      onChange={(e) => setBloodFormData({ ...bloodFormData, bloodGroup: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-extrabold text-rose-600"
                    >
                      {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Units Needed</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={bloodFormData.unitsNeeded}
                      onChange={(e) => setBloodFormData({ ...bloodFormData, unitsNeeded: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital / Medical Center Name</label>
                  <input
                    type="text"
                    required
                    value={bloodFormData.hospitalName}
                    onChange={(e) => setBloodFormData({ ...bloodFormData, hospitalName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attendant / Doctor Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98160 12345"
                    value={bloodFormData.contactPhone}
                    onChange={(e) => setBloodFormData({ ...bloodFormData, contactPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <Button
                  type="submit"
                  variant="danger"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 text-xs"
                >
                  🩸 Broadcast Urgent Blood Request
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: VOLUNTARY BLOOD DONOR REGISTRATION MODAL */}
        {donorModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>❤️ Voluntary Emergency Blood Donor Hero</span>
                </h3>
                <button onClick={() => setDonorModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-slate-500">
                Register to receive instant SMS alerts when a critical patient near your location urgently needs your blood group!
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                setAlertNotification('❤️ Thank you! You have been registered as an Emergency Voluntary Blood Donor.');
                setDonorModalOpen(false);
                setTimeout(() => setAlertNotification(''), 5000);
              }} className="space-y-3">
                <div>
                  <label className="block font-bold mb-1">Donor Name</label>
                  <input type="text" required placeholder="Your full name" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Blood Group</label>
                    <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-bold text-rose-600">
                      {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Mobile Number</label>
                    <input type="tel" required placeholder="+91 98000 00000" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950" />
                  </div>
                </div>
                <Button type="submit" variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5">
                  Register as Emergency Donor Hero
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    );
};
