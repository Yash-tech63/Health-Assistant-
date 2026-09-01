import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse, Shield, Network, ClipboardList, CheckCircle2, ChevronRight,
  ArrowRight, Users, Activity, Eye, Landmark, HelpCircle, MapPin
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Card, CardBody } from '../../components/Card';
import { ConnectedCareNetwork } from '../../components/ConnectedCareNetwork';
import { CloudShader } from '../../components/ui/cloud-shader';


export const Landing: React.FC = () => {
  const { t } = useLanguage();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    switchRole('patient');
    navigate('/portal/patient');
  };

  // Indian Healthcare Journey steps mapping the requested flow
  const workflowSteps = [
    {
      step: '1',
      title: 'Patient Portal Registry',
      facility: 'ABHA Registry Desk',
      desc: 'Patient registers digitally to generate a 14-digit Ayushman Bharat Health Account (ABHA) Card containing diagnostic history.',
      icon: '👨‍🌾',
      tierColor: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/20'
    },
    {
      step: '2',
      title: 'Rural Healthcare Centre (PHC)',
      facility: 'Primary Health Centre (PHC)',
      desc: 'Local physician diagnoses basic symptoms, administers screening tests, generates an ECG report, and writes the initial prescription.',
      icon: '🏥',
      tierColor: 'border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-950/20'
    },
    {
      step: '3',
      title: 'District Referral Hub (CHC)',
      facility: 'Community/District Hospital',
      desc: 'For intermediate symptoms, the PHC doctor transfers the patient. Specialist doctors perform advanced diagnostics like 2D Echo.',
      icon: '🏛️',
      tierColor: 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20'
    },
    {
      step: '4',
      title: 'Super-Specialist Intervention',
      facility: 'Urban Specialist Hospital (IGMC)',
      desc: 'District hospital refers complex cardiac or surgical cases for interventional cardiology, cath lab, and surgical therapies.',
      icon: '🏢',
      tierColor: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/20'
    },
    {
      step: '5',
      title: 'Digital Prescription & Stock',
      facility: 'Pharmacy Inventory Check',
      desc: 'E-Prescriptions connect straight to the hospital pharmacy inventory. Alerts trigger if life-saving medicine drops below thresholds.',
      icon: '💊',
      tierColor: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20'
    },
    {
      step: '6',
      title: 'Follow-Up Recovery',
      facility: 'Home Recovery & Tele-chat',
      desc: 'Patient undergoes digital follow-up through doctor chat and schedules recovery checks at their nearest local village PHC.',
      icon: '🏠',
      tierColor: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section wrapped in WebGL CloudShader */}
      <CloudShader
        speed={0.5}
        count={4}
        skyTopColor="#fce7f3"
        skyBottomColor="#ffffff"
        cloudColor="#ffffff"
        className="w-full"
      >
        <section className="relative overflow-hidden py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 dark:bg-emerald-950/60 backdrop-blur-md text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 shadow-xs">
                <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ayushman Bharat Digital Health Mission</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                Healthcare support, connected to your community.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium leading-relaxed max-w-xl">
                {t('landing.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleStartJourney}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  {t('landing.cta.start')}
                </Button>
                <span className="text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-full font-bold">ABHA #91-8273</span>
              </div>

              {/* Live Flow Showcase */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">1</div>
                  <div>
                    <h5 className="text-xs font-bold dark:text-slate-200">Dhami Rural Health Centre (PHC)</h5>
                    <p className="text-[10px] text-slate-500">Dr. Chauhan completed ECG Consultation</p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 ml-3" />
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">2</div>
                  <div>
                    <h5 className="text-xs font-bold dark:text-slate-200">Shimla District Hospital (CHC)</h5>
                    <p className="text-[10px] text-slate-500">Dr. Sharma approved inbound referral (2D Echo scheduled)</p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 ml-3" />
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs font-bold shadow-xs">3</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400">Urban Specialist Hospital (IGMC)</h5>
                    <p className="text-[10px] text-slate-400">Pending secondary Angiography consultation</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Cardiology Referral Code:</span>
                <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 border border-slate-250 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100">REF-702-HP</span>
              </div>
            </div>
            
            {/* Right Side — Indian Hospital & Patient Treatment Photographic Showcase */}
            <div className="relative space-y-6">
              {/* Card 1: Patient Treatment & Doctor Consultation */}
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl overflow-hidden group">
                <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop"
                    alt="Indian Doctor Consulting & Treating Patient"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      Active Patient Treatment
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      Primary Health Consultation & Medical Care
                    </h4>
                    <p className="text-[11px] text-slate-200">
                      Dhami Rural PHC • Dr. Ramesh Chauhan treating Rajesh Kumar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">ABHA Patient Card</span>
                    <strong className="text-slate-900 dark:text-white truncate block">#91-8273-9281</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Triage Status</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 truncate block">✓ Verified Stable</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Indian Hospital Facility Infrastructure */}
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl overflow-hidden group">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative h-28 sm:h-32 w-full sm:w-44 rounded-2xl overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop"
                      alt="Modern Indian District Hospital Building"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-bold">
                      Tier 2 CHC
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                        District Referral Hub
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        24/7 OPEN
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Shimla District General Hospital
                    </h4>
                    
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span>📍</span>
                      <span>Shimla Town, Himachal Pradesh</span>
                    </p>

                    <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[10px]">ICU Beds Available:</span>
                      <strong className="text-medical-600 dark:text-medical-400 font-bold">85 / 120 Beds</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </CloudShader>

      {/* Connected Care Signature Network */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Connected Healthcare Ecosystem
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Our secure digital pipeline bridges the care pathway from rural citizens to urban tertiary hubs. Hover over a stage to trace the flow.
          </p>
        </div>
        <ConnectedCareNetwork />
      </section>

      {/* The Visual Journey Workflow Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            The Complete Indian Swasthya Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Follow the dynamic healthcare loop connecting rural grassroots with city specialists. Under the Abhimanyu Health Assistants pipeline, diagnosis transcripts, referrals, and prescriptions flow instantly.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflowSteps.map((step, idx) => (
            <Card key={idx} className="relative hover:shadow-lg hover:-translate-y-1 transition-all border-t-4 border-t-medical-500">
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 border rounded-xl flex items-center justify-center text-2xl shadow-sm ${step.tierColor}`}>
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-100 dark:text-slate-800 select-none">
                    0{step.step}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-md font-bold text-slate-900 dark:text-white leading-tight">
                    {step.title}
                  </h4>
                  <span className="inline-block text-[10px] uppercase font-bold text-medical-600 dark:text-medical-400 tracking-wider">
                    {step.facility}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
                  {step.desc}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* ABDM Core Pillars Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          <span className="text-xs uppercase font-bold text-medical-400 tracking-widest">Platform Core Architecture</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Built on Ayushman Bharat standards</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Integrating with national infrastructure like ABDM. Our portals enable role-based dashboards ensuring medical security and continuous diagnostic audit logs.
          </p>
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-medical-400 mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold">ABHA Registry Card</h4>
            <p className="text-slate-450 text-xs leading-relaxed">
              Every profile holds a fully integrated health card to retrieve blood reports, ECG findings, and consult references.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-clinic-400 mb-2">
              <Network className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold">Direct Hospital Referrals</h4>
            <p className="text-slate-450 text-xs leading-relaxed">
              Doctors write digitised references transferring diagnosis sheets instantly to specialist departments, reducing patient waiting queues.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-hospital-400 mb-2">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold">Medicine Inventory Logistics</h4>
            <p className="text-slate-450 text-xs leading-relaxed">
              Hospital drug stock automatically matches patient prescriptions. Automated warning alerts flag low levels of crucial medication.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400 mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold">Audit log & Verification</h4>
            <p className="text-slate-450 text-xs leading-relaxed">
              Every medical transfer is timestamped and stored in central system registers, facilitating clinical inspection.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to explore the swasthya platform?</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Sign up for a mock account or use the quick portal switcher at the top to toggle patient, physician, admin, or clinic dashboards.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={handleStartJourney}>Register Account</Button>
          <Link to="/about">
            <Button variant="secondary">Read Mission Details</Button>
          </Link>
        </div>
      </section>

    </div>
  );
};
