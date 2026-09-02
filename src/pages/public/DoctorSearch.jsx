import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Input } from '../../components/Input';
import { Search, MapPin, Stethoscope, Star } from 'lucide-react';
export const DoctorSearch = () => {
    const { doctors, facilities } = useHealthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [selectedFacility, setSelectedFacility] = useState('All');
    const specialties = ['All', 'Rural General Medicine', 'Gynaecology & Paediatrics', 'Cardiology & General Medicine', 'Interventional Cardiology & Neurology'];
    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
        const matchesFacility = selectedFacility === 'All' || doc.facilityId === selectedFacility;
        return matchesSearch && matchesSpecialty && matchesFacility;
    });
    return (<div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Find Swasthya Doctors</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Search qualified medical officers and specialists across rural health centers, district hospitals, and state medical colleges.
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search */}
        <Input id="doc-search" placeholder="Search Doctor by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<Search className="h-4 w-4"/>}/>

        {/* Specialty filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter Specialty</label>
          <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500">
            {specialties.map(spec => (<option key={spec} value={spec}>{spec}</option>))}
          </select>
        </div>

        {/* Facility filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter Facility Tier</label>
          <select value={selectedFacility} onChange={e => setSelectedFacility(e.target.value)} className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500">
            <option value="All">All Facilities</option>
            {facilities.map(fac => (<option key={fac.id} value={fac.id}>{fac.name} ({fac.type})</option>))}
          </select>
        </div>

      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doc => (<Card key={doc.id} className="hover:shadow-md transition-all">
            <CardBody className="flex gap-4">
              {doc.avatar ? (<img src={doc.avatar} alt={doc.name} onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'text-3xl bg-medical-50 dark:bg-medical-950/40 p-3 h-16 w-16 rounded-2xl flex items-center justify-center border border-medical-200 dark:border-medical-900 shrink-0 font-bold text-medical-700 dark:text-medical-300';
                        fallback.innerText = '👩‍⚕️';
                        parent.appendChild(fallback);
                    }
                }} className="h-16 w-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"/>) : (<div className="text-4xl bg-slate-50 dark:bg-slate-900 p-3 h-16 w-16 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                  👨‍⚕️
                </div>)}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{doc.name}</h3>
                    <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500"/>
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5"/>
                    <span>{doc.facilityName}</span>
                  </p>
                  <div className="pt-2">
                    <span className="font-bold text-[10px] uppercase text-slate-400">Availability:</span>
                    <ul className="list-disc list-inside text-[11px] mt-0.5">
                      {doc.availability.map((av, idx) => (<li key={idx} className="text-slate-600 dark:text-slate-400">{av}</li>))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>))}

        {filteredDoctors.length === 0 && (<div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Stethoscope className="h-10 w-10 text-slate-400 mx-auto mb-2"/>
            <p className="text-sm font-semibold text-slate-650 dark:text-slate-350">No doctors match your filters.</p>
          </div>)}
      </div>

    </div>);
};
