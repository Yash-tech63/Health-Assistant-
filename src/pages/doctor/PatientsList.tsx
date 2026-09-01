import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Search, FileText, Plus, ClipboardCheck, AlertCircle, Heart } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const PatientsList: React.FC = () => {
  const { patients, prescriptions, diagnostics, referrals, createPrescription } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected Patient Details Modal
  const [activePatient, setActivePatient] = useState<typeof patients[0] | null>(null);
  
  // E-Prescription Form Modal state
  const [prescModalOpen, setPrescModalOpen] = useState(false);
  const [newMedicines, setNewMedicines] = useState<{ name: string; dosage: string; duration: string; instructions: string }[]>([
    { name: '', dosage: '1-0-1', duration: '5 days', instructions: 'Take after meals' }
  ]);
  const [prescNotes, setPrescNotes] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.abhaId.includes(searchTerm)
  );

  const handleAddMedRow = () => {
    setNewMedicines(prev => [...prev, { name: '', dosage: '1-0-1', duration: '7 days', instructions: 'Post meals' }]);
  };

  const handleMedChange = (index: number, field: string, val: string) => {
    setNewMedicines(prev => prev.map((med, idx) => {
      if (idx === index) return { ...med, [field]: val };
      return med;
    }));
  };

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    // Filter out blank medicines
    const meds = newMedicines.filter(m => m.name.trim() !== '');
    if (meds.length === 0) {
      alert('Please add at least one medicine.');
      return;
    }

    createPrescription({
      patientId: activePatient.id,
      doctorName: 'Dr. Arvind Sharma',
      facilityName: 'Shimla District General Hospital',
      medicines: meds,
      notes: prescNotes
    });

    setPrescModalOpen(false);
    setNewMedicines([{ name: '', dosage: '1-0-1', duration: '5 days', instructions: 'Take after meals' }]);
    setPrescNotes('');
    alert(`E-Prescription written successfully for ${activePatient.name}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Patient E-Health Registry</h1>
        <p className="text-xs text-slate-500">Query Aadhaar-verified health profiles, write prescriptions, and review diagnostic histories.</p>
      </div>

      {/* Search */}
      <div className="max-w-md bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-xs">
        <Input 
          id="pat-list-search"
          placeholder="Search by patient name or ABHA number..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Patients Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">Patient Account</th>
                  <th className="px-6 py-3">ABHA Card ID</th>
                  <th className="px-6 py-3">Blood Type</th>
                  <th className="px-6 py-3">Location Block</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {p.avatar ? (
                          <img 
                            src={p.avatar} 
                            alt={p.name} 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement('span');
                                fallback.className = 'text-2xl';
                                fallback.innerText = '👨‍🌾';
                                parent.appendChild(fallback);
                              }
                            }}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                          />
                        ) : (
                          <span className="text-2xl">👨‍🌾</span>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.age} Yrs | {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-650 dark:text-slate-350 font-semibold">{p.abhaId}</td>
                    <td className="px-6 py-4">
                      <Badge color="secondary">{p.bloodGroup.replace('Pos', ' +').replace('Neg', ' -')}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{p.location}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="primary" size="sm" onClick={() => setActivePatient(p)}>
                        Open Records
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Patient Profile & Journey Details Modal */}
      {activePatient && (
        <Modal 
          isOpen={!!activePatient} 
          onClose={() => setActivePatient(null)}
          title={`E-Health Profile: ${activePatient.name}`}
          size="lg"
        >
          <div className="space-y-6">
            
            {/* Demographics bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">ABHA Account</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activePatient.abhaId}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Age & Gender</span>
                <span className="font-bold text-slate-850 dark:text-slate-200">{activePatient.age} Yrs / {activePatient.gender}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Blood Group</span>
                <span className="font-bold text-slate-850 dark:text-slate-200">{activePatient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Phone Linked</span>
                <span className="font-bold text-slate-850 dark:text-slate-200">{activePatient.phone}</span>
              </div>
            </div>

            {/* Diagnostic list */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5"><FileText className="h-4.5 w-4.5 text-medical-500" /> Lab & Pathology History</h3>
              <div className="border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                {diagnostics.filter(d => d.patientId === activePatient.id).map(diag => (
                  <div key={diag.id} className="p-3 text-xs flex justify-between items-center bg-white dark:bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-slate-200">{diag.testName}</p>
                      <p className="text-[10px] text-slate-500">🏢 {diag.facilityName} | 📅 {diag.date}</p>
                      {diag.result && <p className="text-[10px] text-medical-600 dark:text-medical-400 font-medium mt-1">Finding: {diag.result}</p>}
                    </div>
                    <Badge color={diag.status === 'Completed' ? 'success' : 'warning'}>{diag.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions list */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5"><Heart className="h-4.5 w-4.5 text-rose-500" /> Issued Prescriptions</h3>
              <div className="space-y-3">
                {prescriptions.filter(p => p.patientId === activePatient.id).map(presc => (
                  <div key={presc.id} className="border border-slate-150 dark:border-slate-800 rounded-xl p-3.5 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-850 dark:text-slate-200">By {presc.doctorName} ({presc.facilityName})</span>
                      <span className="text-[10px] text-slate-400">{presc.date}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-650 dark:text-slate-350">
                      {presc.medicines.map((med, id) => (
                        <li key={id}>
                          <strong>{med.name}</strong> — {med.dosage} ({med.duration}) — <span className="text-slate-450 italic">{med.instructions}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer inside modal */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <Button variant="secondary" onClick={() => setActivePatient(null)}>Close</Button>
              <Button variant="primary" onClick={() => setPrescModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Write E-Prescription
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* E-Prescription Creator Form Modal */}
      {prescModalOpen && activePatient && (
        <Modal 
          isOpen={prescModalOpen} 
          onClose={() => setPrescModalOpen(false)}
          title={`Write E-Prescription: ${activePatient.name}`}
          size="lg"
        >
          <form onSubmit={handlePrescribeSubmit} className="space-y-4">
            
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medicines & Instructions</label>
              
              {newMedicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end border border-slate-100 dark:border-slate-850 p-3 rounded-lg bg-slate-50/30 dark:bg-slate-900/10">
                  <div className="sm:col-span-1.5">
                    <label className="block text-[9px] text-slate-500 mb-0.5">Medicine Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Metformin 500mg" 
                      value={med.name} 
                      onChange={e => handleMedChange(idx, 'name', e.target.value)}
                      className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-0.5">Dosage Pattern</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1-0-1" 
                      value={med.dosage} 
                      onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                      className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-0.5">Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10 days" 
                      value={med.duration} 
                      onChange={e => handleMedChange(idx, 'duration', e.target.value)}
                      className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 mb-0.5">Instructions</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Post meals" 
                      value={med.instructions} 
                      onChange={e => handleMedChange(idx, 'instructions', e.target.value)}
                      className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2 outline-none"
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={handleAddMedRow} leftIcon={<Plus className="h-3 w-3" />}>
                Add Drug Row
              </Button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prescription Clinical Notes</label>
              <textarea 
                rows={3} 
                value={prescNotes}
                onChange={e => setPrescNotes(e.target.value)}
                placeholder="Diagnostic summary, blood pressure check findings, follow-up advice..."
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={() => setPrescModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="success" leftIcon={<ClipboardCheck className="h-4 w-4" />}>
                Finalize E-Prescription
              </Button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
};
