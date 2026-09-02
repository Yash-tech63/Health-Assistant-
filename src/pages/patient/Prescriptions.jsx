import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Pill, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/Input';
export const Prescriptions = () => {
    const { prescriptions, inventory, facilities } = useHealthStore();
    const [searchDrug, setSearchDrug] = useState('');
    const [selectedFacility, setSelectedFacility] = useState('All');
    // Get data specifically for Rajesh Kumar (P-101)
    const patientId = 'P-101';
    const myPrescriptions = prescriptions.filter(p => p.patientId === patientId);
    // Filter inventory
    const filteredInventory = inventory.filter(item => {
        const matchesDrug = item.name.toLowerCase().includes(searchDrug.toLowerCase());
        const matchesFacility = selectedFacility === 'All' || item.facilityId === selectedFacility;
        return matchesDrug && matchesFacility;
    });
    return (<div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Prescriptions & Medicines</h1>
        <p className="text-xs text-slate-500">View active drug orders and check pharmacy stock across network clinics.</p>
      </div>

      {/* Grid: Left is prescriptions, Right is stock check */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prescriptions List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Prescriptions</h3>
          
          {myPrescriptions.map(presc => (<Card key={presc.id}>
              <CardHeader className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Prescribed by {presc.doctorName}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">🏢 {presc.facilityName}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{presc.date}</span>
              </CardHeader>
              <CardBody className="p-0">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2">Medicine</th>
                      <th className="px-4 py-2">Dosage Pattern</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {presc.medicines.map((med, idx) => (<tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          <span className="flex items-center gap-1.5"><Pill className="h-3.5 w-3.5 text-medical-500"/> {med.name}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{med.dosage} <span className="text-[9px] text-slate-400 block">{med.instructions}</span></td>
                        <td className="px-4 py-3 text-slate-650 dark:text-slate-450">{med.duration}</td>
                      </tr>))}
                  </tbody>
                </table>
              </CardBody>
            </Card>))}
        </div>

        {/* Medicine Inventory Checker */}
        <div className="space-y-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Check Live Medicine Availability</h3>
          
          <Card>
            <CardBody className="space-y-4">
              <Input id="inv-drug-search" placeholder="Search drug (e.g. Metformin)..." value={searchDrug} onChange={e => setSearchDrug(e.target.value)} leftIcon={<Search className="h-4 w-4"/>}/>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Facility Location</label>
                <select value={selectedFacility} onChange={e => setSelectedFacility(e.target.value)} className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-105 p-2.5 outline-none focus:ring-2 focus:ring-medical-500">
                  <option value="All">All Tiers</option>
                  {facilities.map(f => (<option key={f.id} value={f.id}>{f.name} ({f.type})</option>))}
                </select>
              </div>

              {/* Inventory results list */}
              <div className="space-y-3 pt-2 border-t border-slate-50 dark:border-slate-800 max-h-72 overflow-y-auto">
                {filteredInventory.map(item => {
            const facility = facilities.find(f => f.id === item.facilityId);
            const isLow = item.stock < item.minStockThreshold;
            return (<div key={item.id} className="p-2 border border-slate-100 dark:border-slate-850 rounded-lg text-xs space-y-1 bg-slate-50/50 dark:bg-slate-900/30">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                        {isLow ? (<span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <AlertTriangle className="h-3 w-3"/> Low Stock
                          </span>) : (<span className="text-[9px] font-bold text-hospital-600 dark:text-hospital-450 flex items-center gap-0.5">
                            <CheckCircle className="h-3 w-3"/> Available
                          </span>)}
                      </div>
                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <p className="truncate">🏥 {facility?.name}</p>
                        <div className="flex justify-between">
                          <span>Stock: {item.stock} units</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350">₹{item.price} / tab</span>
                        </div>
                      </div>
                    </div>);
        })}

                {filteredInventory.length === 0 && (<p className="text-center text-xs text-slate-400 py-6">No medicine matching query found in inventory.</p>)}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

    </div>);
};
