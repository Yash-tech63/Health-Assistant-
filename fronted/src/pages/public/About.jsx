import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
export const About = () => {
    return (<div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      
      {/* Intro */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">About Abhimanyu Health</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
          Abhimanyu Health is a digital ecosystem modeling India's three-tier public health model under the Ayushman Bharat Digital Health Mission (ABDM). We connect village centers, block clinics, district hospitals, and super-specialty cath labs on a single diagnostic grid.
        </p>
      </div>

      {/* The 3-Tier Grid Explainer */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Understanding the Tiered Indian Public Healthcare</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-teal-500">
            <CardHeader className="flex items-center gap-3">
              <div className="h-10 w-10 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-lg flex items-center justify-center font-bold">
                T1
              </div>
              <div>
                <h4 className="font-bold text-sm">Primary Health Centres (PHC)</h4>
                <p className="text-[10px] text-slate-500">Rural Grassroots Tiers</p>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-slate-650 space-y-3">
              <p>Located in rural villages serving local blocks. Led by a General Medical Officer administering initial check-ups, vaccines, blood glucose checks, and standard ECG diagnostics.</p>
              <p className="font-semibold text-teal-600 dark:text-teal-400">Primary task: Screening, early detection, and referral generation.</p>
            </CardBody>
          </Card>

          <Card className="border-t-4 border-t-indigo-500">
            <CardHeader className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                T2
              </div>
              <div>
                <h4 className="font-bold text-sm">Community Health (CHC) / District</h4>
                <p className="text-[10px] text-slate-500">Intermediate Referral Hub</p>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-slate-650 space-y-3">
              <p>Serving larger sub-districts (talukas) or district capitals. Features clinical inpatient wards, basic emergency beds, specialized obstetric care, radiology labs, and pediatric departments.</p>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Primary task: Semi-specialized therapy and diagnostic profiling.</p>
            </CardBody>
          </Card>

          <Card className="border-t-4 border-t-rose-500">
            <CardHeader className="flex items-center gap-3">
              <div className="h-10 w-10 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg flex items-center justify-center font-bold">
                T3
              </div>
              <div>
                <h4 className="font-bold text-sm">Super-Specialty Medical Colleges</h4>
                <p className="text-[10px] text-slate-500">Urban Specialist Tiers</p>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-slate-650 space-y-3">
              <p>State-level medical research centers (e.g., IGMC, AIIMS). Outfitted with cardiac catheterization units, neurologists, neurosurgeons, neonatal ICUs, oncology centers, and critical care units.</p>
              <p className="font-semibold text-rose-600 dark:text-rose-400">Primary task: Complex surgical operations and advanced therapies.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Workflow Explainer */}
      <div className="bg-slate-100 dark:bg-slate-850 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Why Digital Journey Referrals Matter</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Normally, patients in rural districts travel hours to cities, overcrowding specialist OPD wards for symptoms that could be managed locally. Our simulated loop ensures patients consult village PHCs first. If a cardiac complication is flagged, doctors issue a digital referral ticket. 
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The district hospital pre-approves bed availability and schedules diagnostics. Upon discharge, patients return to village PHCs for post-operative recovery monitoring, keeping specialized beds open for emergencies.
        </p>
      </div>

    </div>);
};
