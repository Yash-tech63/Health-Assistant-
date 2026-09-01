import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Users, FileText, ClipboardList, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { appointments, referrals } = useHealthStore();
  const navigate = useNavigate();

  const doctorId = 'D-205'; // Dr. Arvind Sharma
  const myAppointments = appointments.filter(a => a.doctorId === doctorId);
  const scheduledCount = myAppointments.filter(a => a.status === 'Scheduled').length;
  const completedCount = myAppointments.filter(a => a.status === 'Completed').length;
  
  // Pending referrals referred to Shimla District Hospital
  const pendingInbound = referrals.filter(r => r.toFacilityId === 'F-DIST-01' && r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Clinician Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-xs">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Good morning, {user?.name}</h1>
          <p className="text-xs text-slate-300">
            Cardiology & General Medicine Department. Linked Node: <strong className="text-white">Shimla District General Hospital</strong>.
          </p>
        </div>
        <Badge color="info" className="bg-slate-800 text-slate-200 border-slate-700 text-xs py-1 px-3">District Node Hub</Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-t-4 border-t-medical-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Scheduled OPD</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{scheduledCount} Patients</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-medical-50 dark:bg-medical-950/20 text-medical-600 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-t-4 border-t-hospital-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Consults Completed</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{completedCount} Today</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-hospital-50 dark:bg-hospital-950/20 text-hospital-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-t-4 border-t-amber-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Pending Inbound</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pendingInbound} Referrals</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 animate-pulse" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-t-4 border-t-rose-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Diagnostics Queue</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">4 Echo/ECG</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* OPD Queue and shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patient queue table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">OPD Consultations Queue</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/portal/doctor/patients')}>View Patient List</Button>
          </div>

          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Patient Details</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Slot Time</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {myAppointments.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">👨‍🌾</span>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{a.patientName}</p>
                              <p className="text-[9px] text-slate-500 font-mono">ID: {a.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge color={a.type === 'Referral Consultation' ? 'info' : 'secondary'}>{a.type}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-medium">⏰ {a.timeSlot}</td>
                        <td className="px-4 py-3.5 text-right">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => navigate('/portal/doctor/patients')}
                          >
                            Diagnose
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {myAppointments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-400">No scheduled patients today.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Rapid Referral Action Card */}
        <div className="space-y-4 col-span-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Quick Tasks</h3>
          
          <Card>
            <CardBody className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-xs leading-relaxed space-y-2">
                <span className="font-bold flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> Referral Coordination</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Write referral papers and diagnostic transfer logs to move patients to Super Specialty centres or release them back to village PHCs.
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/portal/doctor/referrals')}
              >
                <span>Write Referral Ticket</span>
                <span>→</span>
              </Button>
            </CardBody>
          </Card>
        </div>

      </div>

    </div>
  );
};
