import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Building2, Users, ClipboardCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { referrals, updateReferralStatus, facilities } = useHealthStore();

  // Filter pending referrals referred to Shimla District General Hospital (F-DIST-01)
  const pendingInbound = referrals.filter(r => r.toFacilityId === 'F-DIST-01' && r.status === 'Pending');
  const activeInpatients = referrals.filter(r => r.toFacilityId === 'F-DIST-01' && r.status === 'Approved');

  const facility = facilities.find(f => f.id === 'F-DIST-01');

  const handleApprove = (id: string) => {
    updateReferralStatus(id, 'Approved', 'Patient admitted to clinical diagnostics ward.');
    alert(`Inbound referral R-${id.slice(-4)} approved. Bed allocated.`);
  };

  const handleReject = (id: string) => {
    updateReferralStatus(id, 'Rejected', 'Rejected due to bed limit restrictions.');
  };

  return (
    <div className="space-y-6">
      
      {/* Hospital Node Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-xs">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Hospital Administration Desk</h1>
          <p className="text-xs text-slate-300">
            Node: <strong className="text-white">Shimla District General Hospital</strong> | Registry Code: <strong className="text-white">NHA-F-DIST-01</strong>
          </p>
        </div>
        <Badge color="secondary" className="bg-slate-800 text-slate-200 border-slate-700 text-xs py-1 px-3">Active Registry Node</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-hospital-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Bed Occupancy</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {facility ? `${facility.totalBeds! - facility.bedsAvailable!} / ${facility.totalBeds} Beds` : '35 / 120'}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-hospital-50 dark:bg-hospital-950/20 text-hospital-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-t-4 border-t-medical-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Active Inpatients</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeInpatients.length} Registered</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-medical-50 dark:bg-medical-950/20 text-medical-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-t-4 border-t-amber-500">
          <CardBody className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-450 uppercase font-bold">Pending Inbound Requests</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pendingInbound.length} Referrals</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inbound Referrals Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inbound Triage Referrals</h3>
          
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">From Facility</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {pendingInbound.map(ref => (
                      <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{ref.patientName}</p>
                            <p className="text-[9px] text-slate-500 font-mono">ABHA: {ref.abhaId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-650 dark:text-slate-350">{ref.fromFacilityName}</td>
                        <td className="px-4 py-3.5 text-slate-500 truncate max-w-[150px]" title={ref.reason}>{ref.reason}</td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <Button variant="success" size="sm" onClick={() => handleApprove(ref.id)}>Admit</Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(ref.id)}>Decline</Button>
                        </td>
                      </tr>
                    ))}

                    {pendingInbound.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-400">No pending inbound referrals.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Admitted Registry Overview */}
        <div className="space-y-4 col-span-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Admitted Ward List</h3>
          
          <Card>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {activeInpatients.map(inpat => (
                  <div key={inpat.id} className="p-3 text-xs flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <div>
                      <p className="font-bold text-slate-850 dark:text-slate-200">{inpat.patientName}</p>
                      <p className="text-[9px] text-slate-500">Refer Code: R-{inpat.id.slice(-4)}</p>
                    </div>
                    <span className="text-[9px] bg-hospital-50 dark:bg-hospital-950/20 text-hospital-600 dark:text-hospital-450 border border-hospital-200 dark:border-hospital-900 px-2 py-0.5 rounded-full font-bold">Bed Reserved</span>
                  </div>
                ))}

                {activeInpatients.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-450">No patients currently admitted under referral guidelines.</div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

    </div>
  );
};
