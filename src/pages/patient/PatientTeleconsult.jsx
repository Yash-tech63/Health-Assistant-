import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Video, ShieldCheck, MapPin, Star } from 'lucide-react';
import { VideoConsultationRoom } from '../../components/teleconsult/VideoConsultationRoom';
export const PatientTeleconsult = () => {
    const { user } = useAuth();
    const { doctors } = useHealthStore();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [inCall, setInCall] = useState(false);
    const activeDoc = selectedDoctor || doctors[0]; // Default to Dr. Ramesh Chauhan or selected
    if (inCall && activeDoc) {
        return (<VideoConsultationRoom doctorName={activeDoc.name} doctorSpecialty={activeDoc.specialty} doctorFacility={activeDoc.facilityName} patientName={user?.name || 'Rajesh Kumar'} abhaId={user?.abhaId || '91-8273-9281-2831'} userRole="patient" onEndCall={() => setInCall(false)}/>);
    }
    return (<div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400"/>
            <span>ABDM Teleconsultation Room</span>
          </h1>
          <p className="text-xs text-slate-500">Connect in high-definition video with certified medical officers and specialists across health nodes.</p>
        </div>

        <Badge color="success">
          <ShieldCheck className="h-3.5 w-3.5 mr-1"/>
          <span>ABHA Tele-Health Node Active</span>
        </Badge>
      </div>

      {/* Hero Teleconsult Launcher Banner */}
      <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-none shadow-xl overflow-hidden relative">
        <CardBody className="p-6 sm:p-8 space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"/>
                Live Video Telemedicine Suite
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                Instant Video Consultation for {user?.name || 'Rajesh Kumar'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Connect directly with medical officers at your assigned Primary Health Centre or district specialist hospital with encrypted video feeds and live vitals telemetry.
              </p>
            </div>

            <Button variant="primary" size="lg" onClick={() => setInCall(true)} leftIcon={<Video className="h-5 w-5"/>} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shrink-0 px-6 py-3">
              Start Live Video Call Now
            </Button>
          </div>
        </CardBody>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none"/>
      </Card>

      {/* Doctor Selection Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span>Select Available Teleconsult Doctor</span>
          <span className="text-xs text-slate-500 font-normal">Showing {doctors.length} verified physicians</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => {
            const isSelected = activeDoc.id === doc.id;
            return (<Card key={doc.id} className={`transition-all cursor-pointer ${isSelected
                    ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'hover:shadow-md'}`} onClick={() => setSelectedDoctor(doc)}>
                <CardBody className="flex gap-4">
                  {doc.avatar ? (<img src={doc.avatar} alt={doc.name} onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'text-3xl bg-emerald-50 dark:bg-emerald-950/40 p-3 h-14 w-14 rounded-2xl flex items-center justify-center border border-emerald-200 shrink-0 font-bold';
                            fallback.innerText = '👨‍⚕️';
                            parent.appendChild(fallback);
                        }
                    }} className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"/>) : (<div className="text-3xl bg-slate-50 dark:bg-slate-900 p-3 h-14 w-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                      👨‍⚕️
                    </div>)}

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{doc.specialty}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500"/>
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5"/>
                      <span>{doc.facilityName}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"/>
                        Ready for Video Call
                      </span>
                      <Button variant={isSelected ? 'primary' : 'outline'} size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoctor(doc);
                    setInCall(true);
                }}>
                        {isSelected ? 'Join Room Now' : 'Select Doctor'}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>);
        })}
        </div>
      </div>

    </div>);
};
