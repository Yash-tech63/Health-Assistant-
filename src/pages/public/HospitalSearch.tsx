import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Input } from '../../components/Input';
import { Search, MapPin, Building2 } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { GovtHospitalTokenGenerator } from '../../components/hospital/GovtHospitalTokenGenerator';

export const HospitalSearch: React.FC = () => {
  const { facilities } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredHospitals = facilities.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fac.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || fac.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      
      {/* Government Hospital OPD Token Generator & Photography Showcase */}
      <GovtHospitalTokenGenerator />

      {/* Title */}
      <div className="space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Find Swasthya Hospitals</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Check live bed availability and tier structures across primary health posts, community block clinics, and district referral hubs.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          id="hosp-search"
          placeholder="Search by facility name or location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter Tier Classification</label>
          <select 
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 outline-none focus:ring-2 focus:ring-medical-500"
          >
            <option value="All">All Tiers</option>
            <option value="PHC">Primary Health Centre (PHC)</option>
            <option value="CHC">Community Health Centre (CHC)</option>
            <option value="District">District General Hospital</option>
            <option value="Specialist">Super-Specialist Research Centre</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map(fac => {
          const occupancyRate = fac.totalBeds && fac.bedsAvailable 
            ? Math.round(((fac.totalBeds - fac.bedsAvailable) / fac.totalBeds) * 100) 
            : 0;

          return (
            <Card key={fac.id} className="hover:shadow-md transition-all">
              <CardBody className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    {fac.image ? (
                      <img 
                        src={fac.image} 
                        alt={fac.name} 
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="text-3xl bg-slate-50 dark:bg-slate-900 p-3 h-14 w-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
                        🏥
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-950 dark:text-white text-sm sm:text-base leading-snug">{fac.name}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{fac.location}</span>
                      </p>
                    </div>
                  </div>
                  <Badge color={fac.type === 'PHC' ? 'primary' : fac.type === 'CHC' ? 'info' : fac.type === 'District' ? 'success' : 'danger'}>
                    {fac.type}
                  </Badge>
                </div>

                {/* Bed occupancy progress bar */}
                {fac.totalBeds && (
                  <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-900">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Live Bed Availability:</span>
                      <span className="text-slate-850 dark:text-slate-200">
                        {fac.bedsAvailable} / {fac.totalBeds} Beds Free
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          occupancyRate > 85 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-hospital-500'
                        }`}
                        style={{ width: `${100 - occupancyRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-250 dark:border-slate-700">
            <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-650 dark:text-slate-350">No medical facilities match your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};
