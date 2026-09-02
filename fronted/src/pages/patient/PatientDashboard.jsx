import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Calendar, FileText, Pill, ShieldCheck, MapPin, Activity, Stethoscope, Play, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TreatmentVideoModal } from '../../components/media/TreatmentVideoModal';
export const PatientDashboard = () => {
    const { user } = useAuth();
    const { referrals, appointments, prescriptions, diagnostics } = useHealthStore();
    const navigate = useNavigate();
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    // Get data specifically for Rajesh Kumar (P-101)
    const patientId = 'P-101';
    const myAppointments = appointments.filter(a => a.patientId === patientId).slice(0, 3);
    const myReferrals = referrals.filter(r => r.patientId === patientId);
    const myPrescriptions = prescriptions.filter(p => p.patientId === patientId);
    const myDiagnostics = diagnostics.filter(d => d.patientId === patientId);
    // Workflow tracker steps for Rajesh Kumar's journey
    const journeyTiers = [
        { label: 'Rural PHC', desc: 'Dhami PHC (Consulted Dr. Chauhan)', status: 'Completed' },
        { label: 'District Hospital', desc: 'Shimla District General (Approved - echo done)', status: 'Completed' },
        { label: 'Specialist T3', desc: 'IGMC Specialist (Angiogram pending)', status: 'Active' },
        { label: 'Pharmacy Check', desc: 'Metformin & Atorvastatin stock', status: 'Pending' }
    ];
    return (<div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800 shadow-xs">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Good morning, {user?.name}!</h1>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Welcome to your digital health dashboard. Your ABHA ID links all health center consultations and district hospital records in a unified thread.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 text-xs">
            <span className="font-semibold text-slate-400 block mb-1">Assigned Health Outpost</span>
            <span className="font-bold text-slate-100 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-400"/> Dhami Rural PHC</span>
          </div>

          <Button variant="primary" size="sm" onClick={() => setVideoModalOpen(true)} leftIcon={<Play className="h-4 w-4 fill-white"/>} className="bg-rose-600 hover:bg-rose-700 text-white font-bold self-center shadow-md py-3">
            Watch Treatment Video Guide
          </Button>

          <Button variant="outline" size="sm" onClick={() => navigate('/hospitals')} leftIcon={<Landmark className="h-4 w-4 text-rose-400"/>} className="border-slate-700 text-slate-200 hover:bg-slate-800 font-bold self-center shadow-md py-3">
            Generate Govt OPD Token 🎫
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (ABHA & Journey Tracker) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Swasthya Journey Tracker */}
          <Card className="border-l-4 border-l-teal-600">
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Active Swasthya Journey</h3>
                <p className="text-[10px] text-slate-500">Track your referral and treatment path through Indian healthcare tiers</p>
              </div>
              <Activity className="h-4 w-4 text-teal-600 animate-pulse"/>
            </CardHeader>
            <CardBody className="p-6">
              <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                {journeyTiers.map((j, idx) => (<div key={idx} className="relative">
                    {/* Circle indicators */}
                    <div className={`absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${j.status === 'Completed'
                ? 'bg-hospital-500 border-hospital-500 text-white'
                : j.status === 'Active'
                    ? 'bg-medical-500 border-medical-500 text-white animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400 dark:bg-slate-900 dark:border-slate-700'}`}>
                      {j.status === 'Completed' ? '✓' : idx + 1}
                    </div>

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className={`text-xs font-bold ${j.status === 'Completed'
                ? 'text-slate-800 dark:text-slate-200'
                : j.status === 'Active'
                    ? 'text-medical-600 dark:text-medical-450'
                    : 'text-slate-400'}`}>
                          {j.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{j.desc}</p>
                      </div>
                      <Badge color={j.status === 'Completed' ? 'success' : j.status === 'Active' ? 'primary' : 'secondary'}>
                        {j.status}
                      </Badge>
                    </div>
                  </div>))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions Portal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card hoverable onClick={() => navigate('/portal/patient/book')} className="text-center">
              <CardBody className="py-6 space-y-2">
                <div className="mx-auto h-10 w-10 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-5 w-5"/>
                </div>
                <h4 className="font-bold text-xs">Consult Doctor</h4>
                <p className="text-[9px] text-slate-550">Book local or referral OPD appointments</p>
              </CardBody>
            </Card>

            <Card hoverable onClick={() => navigate('/portal/patient/records')} className="text-center">
              <CardBody className="py-6 space-y-2">
                <div className="mx-auto h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5"/>
                </div>
                <h4 className="font-bold text-xs">Diagnostic Reports</h4>
                <p className="text-[9px] text-slate-550">Download ECG, Echo, & blood tests</p>
              </CardBody>
            </Card>

            <Card hoverable onClick={() => navigate('/portal/patient/prescriptions')} className="text-center">
              <CardBody className="py-6 space-y-2">
                <div className="mx-auto h-10 w-10 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full flex items-center justify-center">
                  <Pill className="h-5 w-5"/>
                </div>
                <h4 className="font-bold text-xs">Pharmacies & Stock</h4>
                <p className="text-[9px] text-slate-550">Check local generic inventory levels</p>
              </CardBody>
            </Card>
          </div>

        </div>

        {/* Right Column (ABHA Card & Upcoming Appointments) */}
        <div className="space-y-6">
          
          {/* Visual ABHA Health Card */}
          <Card className="bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white border-transparent">
            <CardBody className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-medical-400 font-bold">National Health Authority</span>
                  <h3 className="text-sm font-extrabold">{user?.name}</h3>
                </div>
                <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center text-xs">💳</div>
              </div>

              <div className="space-y-1 font-mono">
                <span className="text-[8px] text-slate-400 block leading-none">ABHA HEALTH ID</span>
                <span className="text-sm font-bold tracking-widest text-slate-200">{user?.abhaId}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] pt-4 border-t border-slate-800 text-slate-400">
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Gender</span>
                  <span className="font-bold text-slate-350">Male (42 Yrs)</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Blood Group</span>
                  <span className="font-bold text-slate-350">O +</span>
                </div>
              </div>
            </CardBody>
            <CardFooter className="bg-slate-950 border-t border-slate-900/50 flex justify-between items-center text-[10px] text-slate-500 px-4 py-2">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-hospital-500"/> Aadhaar Verified</span>
              <span>Govt of India ABDM</span>
            </CardFooter>
          </Card>

          {/* Upcoming Consultations */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Scheduled Appointments</h3>
              <Calendar className="h-4 w-4 text-slate-400"/>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {myAppointments.map(a => (<div key={a.id} className="p-4 space-y-2 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{a.doctorName}</span>
                      <Badge color={a.status === 'Completed' ? 'success' : 'info'}>{a.status}</Badge>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <p>🏥 {a.facilityName}</p>
                      <p>📅 {a.date} | ⏰ {a.timeSlot}</p>
                    </div>
                  </div>))}
                
                {myAppointments.length === 0 && (<div className="p-6 text-center text-xs text-slate-400">
                    No scheduled appointments.
                  </div>)}
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {videoModalOpen && (<TreatmentVideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)}/>)}

    </div>);
};
