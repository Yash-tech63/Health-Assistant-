import React from 'react';
import { CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
export const AmbulanceStatusTracker = ({ currentStep = 'on_the_way', requestId = '#AMB-1024', className = '', }) => {
    const steps = [
        {
            id: 'received',
            label: 'Request Received',
            sub: 'Logged in Central Grid',
            icon: <CheckCircle2 className="h-4 w-4"/>,
        },
        {
            id: 'assigned',
            label: 'Ambulance Assigned',
            sub: 'Unit AMB-204 Dispatched',
            icon: <Truck className="h-4 w-4"/>,
        },
        {
            id: 'on_the_way',
            label: 'Ambulance On The Way',
            sub: 'En Route to Patient',
            icon: <Clock className="h-4 w-4"/>,
        },
        {
            id: 'arrived',
            label: 'Ambulance Arrived',
            sub: 'Patient On-Site Triage',
            icon: <ShieldAlert className="h-4 w-4"/>,
        },
    ];
    const stepOrder = ['received', 'assigned', 'on_the_way', 'arrived'];
    const currentIndex = stepOrder.indexOf(currentStep);
    return (<div className={`p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800/50">
            Emergency Dispatch Tracker
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Dispatch Reference {requestId}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"/>
          Active Tracking
        </div>
      </div>

      {/* Steps List / Tracker Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Background Connecting Line on Desktop */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"/>

        {steps.map((step, index) => {
            const isDone = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            return (<div key={step.id} className="relative flex md:flex-col items-center gap-3.5 md:gap-2 z-10">
              {/* Step Circle */}
              <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0
                  ${isDone
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                    : isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-200 dark:shadow-none ring-4 ring-amber-500/20 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}
                `}>
                {isDone ? (<CheckCircle2 className="h-5 w-5"/>) : isCurrent ? (<span className="h-3 w-3 rounded-full bg-slate-950 animate-ping"/>) : (<span>{index + 1}</span>)}
              </div>

              {/* Text Information */}
              <div className="md:text-center space-y-0.5">
                <h4 className={`text-xs font-bold ${isCurrent
                    ? 'text-amber-600 dark:text-amber-400'
                    : isDone
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'}`}>
                  {isDone ? `✓ ${step.label}` : isCurrent ? `● ${step.label}` : `○ ${step.label}`}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {step.sub}
                </p>
              </div>
            </div>);
        })}
      </div>
    </div>);
};
