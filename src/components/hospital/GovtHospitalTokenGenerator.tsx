import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Building2, Ticket, Clock, CheckCircle, ShieldCheck, MapPin, Printer, Landmark, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface GovtHospital {
  id: string;
  name: string;
  type: 'Civil District Hospital' | 'Primary Health Centre' | 'Community Health Centre' | 'Super-Specialty Medical College';
  location: string;
  bedsAvailable: number;
  image: string;
  opdHours: string;
}

export const govtHospitalsList: GovtHospital[] = [
  {
    id: 'GH-01',
    name: 'Shimla District General Civil Hospital',
    type: 'Civil District Hospital',
    location: 'Mall Road, Shimla, Himachal Pradesh',
    bedsAvailable: 85,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1000&auto=format&fit=crop',
    opdHours: '08:00 AM - 02:00 PM'
  },
  {
    id: 'GH-02',
    name: 'Dhami Rural Primary Health Centre (PHC)',
    type: 'Primary Health Centre',
    location: 'Dhami Block, Shimla District, HP',
    bedsAvailable: 12,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
    opdHours: '09:00 AM - 04:00 PM'
  },
  {
    id: 'GH-03',
    name: 'Sunni Community Health Centre (CHC)',
    type: 'Community Health Centre',
    location: 'Sunni Tehsil, Himachal Pradesh',
    bedsAvailable: 34,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop',
    opdHours: '08:30 AM - 03:30 PM'
  },
  {
    id: 'GH-04',
    name: 'IGMC Government Medical College & Specialist Cath Lab',
    type: 'Super-Specialty Medical College',
    location: 'Snowdown, Lakkar Bazaar, Shimla',
    bedsAvailable: 140,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop',
    opdHours: '24/7 Emergency & OPD'
  }
];

export const GovtHospitalTokenGenerator: React.FC = () => {
  const { user } = useAuth();
  
  const [selectedHospital, setSelectedHospital] = useState<GovtHospital>(govtHospitalsList[0]);
  const [department, setDepartment] = useState('General Medicine OPD');
  const [generatedToken, setGeneratedToken] = useState<{
    tokenId: string;
    queueNumber: number;
    estTime: string;
    date: string;
    dept: string;
    hospitalName: string;
    patientName: string;
    abhaId: string;
  } | null>(null);

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    
    const randomBlock = Math.floor(1000 + Math.random() * 9000);
    const queuePos = Math.floor(3 + Math.random() * 8);
    const now = new Date();
    now.setMinutes(now.getMinutes() + queuePos * 8);
    
    const estTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    setGeneratedToken({
      tokenId: `HP-OPD-${randomBlock}`,
      queueNumber: queuePos,
      estTime: estTimeStr,
      date: todayStr,
      dept: department,
      hospitalName: selectedHospital.name,
      patientName: user?.name || 'Rajesh Kumar',
      abhaId: user?.abhaId || '91-8273-9281-2831',
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <span>Government Hospital Digital OPD Token Generator</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate official government hospital queue tokens linked to your ABHA health ID for zero-wait OPD checkups.
          </p>
        </div>

        <Badge color="secondary" className="px-3 py-1 text-xs">
          🏛️ ABDM National OPD Portal Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Token Generator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-t-4 border-t-rose-600 shadow-md">
            <CardHeader>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="h-4 w-4 text-rose-600" />
                <span>Issue Government OPD Queue Slip</span>
              </h3>
            </CardHeader>

            <CardBody className="space-y-4">
              <form onSubmit={handleGenerateToken} className="space-y-4">
                
                {/* Select Hospital */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Government Health Facility
                  </label>
                  <select
                    value={selectedHospital.id}
                    onChange={e => {
                      const found = govtHospitalsList.find(h => h.id === e.target.value);
                      if (found) setSelectedHospital(found);
                    }}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {govtHospitalsList.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select OPD Specialty Department
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="General Medicine OPD">General Medicine & Chest OPD</option>
                    <option value="Cardiology OPD & ECG">Cardiology OPD & 12-Lead ECG</option>
                    <option value="Pediatrics & Immunization">Pediatrics & Vaccination OPD</option>
                    <option value="Orthopedics & Fracture Clinic">Orthopedics & Trauma Clinic</option>
                    <option value="Emergency 108 Triage OPD">Emergency 108 Triage Desk</option>
                  </select>
                </div>

                {/* OPD Timings Note */}
                <div className="bg-pink-50 dark:bg-rose-950/30 p-3 rounded-xl border border-pink-200 dark:border-rose-900 text-[11px] text-rose-900 dark:text-rose-300 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-rose-600" />
                    <span>Facility OPD Timings: {selectedHospital.opdHours}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Live bed availability: <strong>{selectedHospital.bedsAvailable} Beds Available</strong>
                  </p>
                </div>

                <Button type="submit" variant="primary" className="w-full font-bold py-3">
                  Generate Government OPD Token Now
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Issued Government OPD Token Slip Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {generatedToken ? (
            <Card className="border-2 border-rose-500 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
              
              {/* Government Slip Header Seal */}
              <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-rose-800 text-white p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/80">Government Health Department</span>
                    <h3 className="text-lg font-extrabold tracking-tight">{generatedToken.hospitalName}</h3>
                  </div>
                  <Badge color="secondary" className="bg-white text-rose-900 font-extrabold text-xs shadow-xs">
                    OFFICIAL OPD TOKEN
                  </Badge>
                </div>
                <p className="text-[10px] text-pink-100 font-mono">Issued via ABDM National Health Grid • Date: {generatedToken.date}</p>
              </div>

              <CardBody className="p-6 space-y-6">
                
                {/* Main Token Number & Queue Callout */}
                <div className="grid grid-cols-2 gap-4 bg-pink-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-pink-200 dark:border-slate-700 text-center">
                  <div className="space-y-1 border-r border-pink-200 dark:border-slate-700 pr-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Government Token ID</span>
                    <h4 className="text-xl sm:text-2xl font-black text-rose-600 font-mono">{generatedToken.tokenId}</h4>
                  </div>

                  <div className="space-y-1 pl-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live Queue Position</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                      Queue #{generatedToken.queueNumber}
                    </h4>
                  </div>
                </div>

                {/* Token Details Matrix */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
                    <p className="font-bold text-slate-900 dark:text-white">{generatedToken.patientName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ABHA #{generatedToken.abhaId}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Specialty Department</span>
                    <p className="font-bold text-rose-600 dark:text-rose-400">{generatedToken.dept}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Call Time</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-rose-600" /> {generatedToken.estTime}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <Badge color="success">🟢 Active in Queue</Badge>
                  </div>
                </div>

                {/* Print Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Please present this slip at Government Hospital Room 3 OPD Counter</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    leftIcon={<Printer className="h-4 w-4" />}
                  >
                    Print Token Slip
                  </Button>
                </div>

              </CardBody>
            </Card>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-900/60 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-pink-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto text-3xl font-bold">
                🎫
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">No Token Issued Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your nearest Government Hospital and OPD department on the left to generate an instant digital queue slip.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Government Hospital Infrastructure Photography Showcase */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge color="primary" className="px-3 py-1 text-xs">
            🏢 Government Health Infrastructure Photography
          </Badge>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            State Government Civil Hospitals & Medical Colleges
          </h3>
          <p className="text-xs text-slate-500">
            Certified Indian public healthcare institutions providing free OPD consultations, diagnostics, and emergency triage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {govtHospitalsList.map(h => (
            <Card key={h.id} className="overflow-hidden hover:shadow-lg transition-all group border-slate-200 dark:border-slate-800">
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={h.image}
                  alt={h.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-2 left-2">
                  <Badge color="secondary" className="bg-slate-950/80 text-white border-slate-800 text-[10px]">
                    {h.type}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-rose-400" />
                  <span className="truncate max-w-[200px]">{h.location}</span>
                </div>
              </div>

              <CardBody className="p-4 space-y-2">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">{h.name}</h4>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{h.bedsAvailable} Beds Available</span>
                  <button
                    onClick={() => setSelectedHospital(h)}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
                  >
                    Select for Token
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
