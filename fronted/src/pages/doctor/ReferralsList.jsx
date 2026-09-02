import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Plus, CheckCircle } from 'lucide-react';
import { Modal } from '../../components/Modal';
export const ReferralsList = () => {
    const { referrals, facilities, doctors, patients, createReferral } = useHealthStore();
    const [referModalOpen, setReferModalOpen] = useState(false);
    // Form states
    const [selectedPatientId, setSelectedPatientId] = useState('P-101');
    const [destinationFacilityId, setDestinationFacilityId] = useState('F-SPEC-01');
    const [referralReason, setReferralReason] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const doctorId = 'D-205'; // Dr. Arvind Sharma
    const doctorName = 'Dr. Arvind Sharma';
    // Filter referrals written by this doctor or referred to their facility
    const myOutboundReferrals = referrals.filter(r => r.referredByDoctorId === doctorId);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!referralReason) {
            alert('Please fill out the reason.');
            return;
        }
        const patient = patients.find(p => p.id === selectedPatientId);
        const destFacility = facilities.find(f => f.id === destinationFacilityId);
        if (!patient || !destFacility)
            return;
        createReferral({
            patientId: patient.id,
            patientName: patient.name,
            abhaId: patient.abhaId,
            fromFacilityId: 'F-DIST-01', // Doctor's facility
            fromFacilityName: 'Shimla District General Hospital',
            toFacilityId: destFacility.id,
            toFacilityName: destFacility.name,
            reason: referralReason,
            referredByDoctorId: doctorId,
            referredByDoctorName: doctorName,
            notes: clinicalNotes
        });
        setReferModalOpen(false);
        setReferralReason('');
        setClinicalNotes('');
        alert(`Referral written successfully for ${patient.name} to ${destFacility.name}.`);
    };
    return (<div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Referrals Manager</h1>
          <p className="text-xs text-slate-500">Transfer patients securely between local primary, district, and state specialty facilities.</p>
        </div>
        <Button variant="primary" onClick={() => setReferModalOpen(true)} leftIcon={<Plus className="h-4 w-4"/>}>
          New Referral Slip
        </Button>
      </div>

      {/* Referral Slip list */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Outbound Journey Referrals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myOutboundReferrals.map(ref => (<Card key={ref.id} className="relative border-t-4 border-t-medical-500">
              <CardBody className="space-y-4 text-xs">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-855 dark:text-slate-100">{ref.patientName}</h4>
                    <p className="text-[9px] text-slate-500 font-mono">ABHA: {ref.abhaId}</p>
                  </div>
                  <Badge color={ref.status === 'Approved' ? 'success' : ref.status === 'Pending' ? 'warning' : 'primary'}>
                    {ref.status}
                  </Badge>
                </div>

                <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800">
                  <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">From:</strong> {ref.fromFacilityName}</p>
                  <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">To:</strong> {ref.toFacilityName}</p>
                  <p className="text-slate-650 dark:text-slate-350 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-750 dark:text-slate-300">Indication:</strong> {ref.reason}
                  </p>
                </div>

                {ref.notes && (<p className="text-slate-500 leading-relaxed italic"><strong className="text-slate-700 dark:text-slate-400 not-italic">Clinical Transfer Note:</strong> "{ref.notes}"</p>)}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Referred on: {ref.date}</span>
                  <span className="font-mono text-slate-500">Code: R-{ref.id.slice(-4)}</span>
                </div>
              </CardBody>
            </Card>))}
        </div>
      </div>

      {/* Refer Patient Modal */}
      {referModalOpen && (<Modal isOpen={referModalOpen} onClose={() => setReferModalOpen(false)} title="Create Outbound Referral Transfer Slip" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Patient Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Patient</label>
              <select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500">
                {patients.map(p => (<option key={p.id} value={p.id}>{p.name} (ABHA: {p.abhaId})</option>))}
              </select>
            </div>

            {/* Destination Facility */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Refer To Destination Facility</label>
              <select value={destinationFacilityId} onChange={e => setDestinationFacilityId(e.target.value)} className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500">
                {facilities.map(fac => (<option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>))}
              </select>
            </div>

            {/* Reason for transfer */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Clinical Referral Reason</label>
              <textarea rows={3} value={referralReason} onChange={e => setReferralReason(e.target.value)} placeholder="e.g. ECG showing ST depression; needs tertiary cath lab profiling and angiogram." className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-medical-500" required/>
            </div>

            {/* Clinical Transfer Notes */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transfer Summary / Notes</label>
              <textarea rows={2} value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)} placeholder="Initial vitals, aspirin administered, patient stable for travel..." className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-medical-500"/>
            </div>

            <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={() => setReferModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" leftIcon={<CheckCircle className="h-4 w-4"/>}>
                Authorize Referral Transfer
              </Button>
            </div>

          </form>
        </Modal>)}

    </div>);
};
