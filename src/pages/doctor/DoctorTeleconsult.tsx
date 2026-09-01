import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Video, ShieldCheck, User, PhoneCall, CheckCircle, Clock } from 'lucide-react';
import { VideoConsultationRoom } from '../../components/teleconsult/VideoConsultationRoom';

export const DoctorTeleconsult: React.FC = () => {
  const { user } = useAuth();
  const { patients } = useHealthStore();
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [inCall, setInCall] = useState(false);

  const activePatient = selectedPatient || patients[0]; // Default to Rajesh Kumar or selected

  if (inCall && activePatient) {
    return (
      <VideoConsultationRoom
        doctorName={user?.name || 'Dr. Arvind Sharma'}
        doctorSpecialty={user?.specialty || 'General Medicine & Cardiology'}
        doctorFacility={user?.facilityName || 'Shimla District General Hospital'}
        patientName={activePatient.name}
        abhaId={activePatient.abhaId}
        userRole="doctor"
        onEndCall={() => setInCall(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Doctor Teleconsultation Terminal</span>
          </h1>
          <p className="text-xs text-slate-500">Conduct encrypted telemedicine consultations, review live patient vitals, and issue signed e-prescriptions.</p>
        </div>

        <Badge color="success">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          <span>Doctor Terminal Ready</span>
        </Badge>
      </div>

      {/* Hero Doctor Launcher Banner */}
      <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-none shadow-xl overflow-hidden relative">
        <CardBody className="p-6 sm:p-8 space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Next Waiting Patient
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                Patient: {activePatient.name} (ABHA #{activePatient.abhaId})
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activePatient.name} ({activePatient.age} Yrs / {activePatient.gender}) is currently waiting in the video lobby for rural ECG consultation follow-up.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setInCall(true)}
              leftIcon={<Video className="h-5 w-5" />}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shrink-0 px-6 py-3"
            >
              Admit Patient & Start Video Call
            </Button>
          </div>
        </CardBody>

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />
      </Card>

      {/* Patient Queue List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live Patient Waiting Queue</h3>

        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Patient Profile</th>
                    <th className="px-6 py-3">ABHA Card</th>
                    <th className="px-6 py-3">Queue Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {patients.map((pat, idx) => {
                    const isSelected = activePatient.id === pat.id;
                    return (
                      <tr 
                        key={pat.id} 
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/10 cursor-pointer ${
                          isSelected ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                        }`}
                        onClick={() => setSelectedPatient(pat)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {pat.avatar ? (
                              <img
                                src={pat.avatar}
                                alt={pat.name}
                                className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <span className="text-2xl">👨‍🌾</span>
                            )}
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{pat.name}</p>
                              <p className="text-[10px] text-slate-500">{pat.age} Yrs | {pat.gender}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {pat.abhaId}
                        </td>

                        <td className="px-6 py-4">
                          {idx === 0 ? (
                            <Badge color="success" className="animate-pulse">
                              🟢 Next In Line
                            </Badge>
                          ) : (
                            <Badge color="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Waiting ({idx * 10} mins)
                            </Badge>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            variant={isSelected ? 'primary' : 'outline'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(pat);
                              setInCall(true);
                            }}
                            leftIcon={<Video className="h-3.5 w-3.5" />}
                          >
                            Launch Consultation
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

    </div>
  );
};
