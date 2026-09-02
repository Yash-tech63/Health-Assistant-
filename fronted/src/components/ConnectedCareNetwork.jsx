import React, { useState } from 'react';
import { User, Building2, Stethoscope, Landmark, ShieldCheck, Heart } from 'lucide-react';
export const ConnectedCareNetwork = () => {
    const [activeStep, setActiveStep] = useState(null);
    const steps = [
        {
            id: 1,
            label: 'Patient',
            sub: 'ABHA Card Generation',
            desc: 'Patient registers digitally using Aadhaar to generate a 14-digit ABHA ID to secure diagnostic records.',
            icon: <User className="h-5 w-5"/>,
            color: 'bg-blue-500 text-white',
            glow: 'shadow-blue-200 dark:shadow-none'
        },
        {
            id: 2,
            label: 'Health Centre',
            sub: 'Primary PHC Screening',
            desc: 'Rural PHCs administer initial consultation, check vital metrics, upload ECG logs, and route cases to sub-districts.',
            icon: <Building2 className="h-5 w-5"/>,
            color: 'bg-teal-500 text-white',
            glow: 'shadow-teal-200 dark:shadow-none'
        },
        {
            id: 3,
            label: 'Doctor',
            sub: 'Specialist Consultation',
            desc: 'Physicians inspect diagnostics, author digital e-prescriptions, and compile standardized clinical referral forms.',
            icon: <Stethoscope className="h-5 w-5"/>,
            color: 'bg-indigo-500 text-white',
            glow: 'shadow-indigo-200 dark:shadow-none'
        },
        {
            id: 4,
            label: 'Hospital',
            sub: 'District Bed & Pharmacy Triage',
            desc: 'District hospitals track inpatient beds, dispatch e-prescriptions, and auto-flag pharmacy generic stock shortages.',
            icon: <Landmark className="h-5 w-5"/>,
            color: 'bg-rose-500 text-white',
            glow: 'shadow-rose-200 dark:shadow-none'
        },
        {
            id: 5,
            label: 'Specialist',
            sub: 'Super-Specialist Cath Lab',
            desc: 'Urban advanced care panels receive inbound digital referrals, perform operations, and transcript surgical workflows.',
            icon: <ShieldCheck className="h-5 w-5"/>,
            color: 'bg-emerald-500 text-white',
            glow: 'shadow-emerald-200 dark:shadow-none'
        },
        {
            id: 6,
            label: 'Follow-Up',
            sub: 'Local Recovery & Telehealth',
            desc: 'Discharged patients track recovery logs at their local PHCs and consult doctors virtually via unified secure chats.',
            icon: <Heart className="h-5 w-5"/>,
            color: 'bg-amber-500 text-white',
            glow: 'shadow-amber-200 dark:shadow-none'
        }
    ];
    return (<div className="w-full space-y-8 py-6">
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-150/70 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm relative overflow-hidden">
        
        {/* Connection flow diagram */}
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 z-10">
          {/* Main animated background flow line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-blue-300 via-indigo-300 to-amber-300 hidden md:block z-0 opacity-40"/>

          {/* SVG animation layer for flowing care dots */}
          <svg className="absolute top-1/2 left-0 right-0 w-full h-8 -translate-y-1/2 hidden md:block pointer-events-none z-0">
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="transparent" strokeWidth="0"/>
            <circle r="4" fill="rgba(13, 148, 136, 0.6)">
              <animateMotion dur="6s" repeatCount="indefinite" path="M 25 16 L 900 16"/>
            </circle>
            <circle r="3" fill="rgba(99, 102, 241, 0.6)">
              <animateMotion dur="8s" begin="2s" repeatCount="indefinite" path="M 25 16 L 900 16"/>
            </circle>
          </svg>

          {steps.map((step, idx) => {
            const isActive = activeStep === step.id;
            return (<div key={step.id} className="flex flex-col items-center text-center relative z-10 group cursor-pointer flex-1" onMouseEnter={() => setActiveStep(step.id)} onMouseLeave={() => setActiveStep(null)}>
                {/* Node bubble */}
                <div className={`
                  h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 relative
                  ${step.color} ${step.glow} 
                  group-hover:scale-110 group-hover:rotate-6
                  ${isActive ? 'ring-4 ring-offset-2 ring-medical-500 dark:ring-offset-slate-900' : ''}
                `}>
                  {step.icon}
                  {/* Subtle Pulse ring */}
                  <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75 pointer-events-none"/>
                </div>

                {/* Text details */}
                <div className="mt-3.5 space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                    {step.sub}
                  </p>
                </div>

                {/* Responsive connection indicator on mobile */}
                {idx < steps.length - 1 && (<div className="h-6 w-0.5 bg-slate-250 dark:bg-slate-800 md:hidden my-2"/>)}
              </div>);
        })}
        </div>

        {/* Dynamic Tooltip / Explainer Section */}
        <div className="mt-8 border-t border-slate-150 dark:border-slate-800/80 pt-5 min-h-[90px] flex items-center justify-center transition-all duration-300">
          {activeStep !== null ? (<div className="text-center space-y-2 max-w-2xl page-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-medical-50 dark:bg-medical-950/20 text-medical-600 dark:text-medical-400 border border-medical-250/20">
                Connected Care Phase {activeStep}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                {steps.find(s => s.id === activeStep)?.desc}
              </p>
            </div>) : (<div className="text-center text-slate-400 dark:text-slate-500 italic text-sm flex flex-col items-center gap-1.5 float-subtle">
              <span>Hover over any phase above to trace the clinical journey in detail</span>
            </div>)}
        </div>

      </div>
    </div>);
};
