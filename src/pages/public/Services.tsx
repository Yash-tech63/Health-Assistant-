import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Stethoscope, ShieldAlert, Heart, Calendar, Play } from 'lucide-react';
import { TreatmentVideoModal, treatmentVideosList } from '../../components/media/TreatmentVideoModal';

export const Services: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVidId, setSelectedVidId] = useState('VID-01');

  const serviceCategories = [
    {
      title: 'Primary Health Care & Wellness',
      tier: 'Level 1: Rural PHC',
      items: [
        'Outpatient Department (OPD) General Consultation',
        'National Immunization Program & Vaccine Drives',
        'Maternal & Antenatal Health Checks',
        'Basic Diagnostic Screening (ECG, Glucose, Hb)',
        'Distribution of essential generic medicines'
      ]
    },
    {
      title: 'Secondary Specialised Care',
      tier: 'Level 2: District Hospital',
      items: [
        'Pediatric, Orthopedic & Gynaecologic Specialties',
        'Advanced Diagnostic Labs (2D Echocardiogram, X-Ray)',
        'Operation Theatres for Minor Surgeries',
        'Inpatient Admission Ward & Emergency Beds',
        'Hospital to Hospital Transfer & Referral Coordination'
      ]
    },
    {
      title: 'Tertiary Critical Care',
      tier: 'Level 3: Specialty Hospital',
      items: [
        'Interventional Cardiology & Cath Lab Procedures',
        'Neurosciences & Complex Neurosurgery Wards',
        'Nephrology, Dialysis & Kidney Transplant Care',
        'Oncology & Cancer Radiotherapy Departments',
        'Intensive Care Units (ICU, NICU, PICU)'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Healthcare Service Catalog</h1>
        <p className="text-slate-650 dark:text-slate-400 text-sm">
          Access specific medical procedures based on the referral structure. If you need specialist care, consult a primary center for a digital referral ticket.
        </p>
      </div>

      <div className="space-y-8">
        {serviceCategories.map((cat, idx) => (
          <Card key={idx} className="border-l-4 border-l-medical-600">
            <CardHeader className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{cat.title}</h3>
              <span className="text-xs bg-medical-50 dark:bg-medical-950/20 text-medical-700 dark:text-medical-400 px-2 py-0.5 border border-medical-200 dark:border-medical-900 rounded-full font-bold">
                {cat.tier}
              </span>
            </CardHeader>
            <CardBody>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item, idy) => (
                  <li key={idy} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <Stethoscope className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 3D & Video Medical Treatment Demonstration Protocols */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge color="success" className="px-3 py-1 text-xs">
            🎥 Interactive 3D & Video Clinical Demonstrations
          </Badge>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Watch How Doctors Treat Patients Step-by-Step
          </h2>
          <p className="text-xs text-slate-500">
            Interactive 3D video procedural guides demonstrating primary PHC consultations, 2D Echocardiograms, Cath Lab Angiography, and 108 Ambulance Triage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatmentVideosList.map(v => (
            <Card key={v.id} className="hover:shadow-lg transition-all group overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={v.posterUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <button
                  onClick={() => {
                    setSelectedVidId(v.id);
                    setVideoModalOpen(true);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/30 hover:bg-slate-950/10 transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </div>
                </button>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-[10px]">
                  <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">{v.category}</span>
                  <span className="font-mono">{v.duration}</span>
                </div>
              </div>

              <CardBody className="space-y-2 p-4">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight line-clamp-2">{v.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{v.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVidId(v.id);
                    setVideoModalOpen(true);
                  }}
                  className="w-full text-xs font-bold mt-2"
                >
                  Watch 3D Treatment Guide
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {videoModalOpen && (
        <TreatmentVideoModal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          initialVideoId={selectedVidId}
        />
      )}

    </div>
  );
};
