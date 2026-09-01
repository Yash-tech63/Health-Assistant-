import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ShieldAlert, CheckCircle, Search, UserCheck } from 'lucide-react';
import { Input } from '../../components/Input';

export const UserManagement: React.FC = () => {
  const { doctors, facilities } = useHealthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated verification toggles for demonstration
  const [verifiedDocs, setVerifiedDocs] = useState<Record<string, boolean>>({
    'D-201': true,
    'D-202': true,
    'D-205': true,
    'D-206': true
  });

  const handleToggleVerify = (id: string) => {
    setVerifiedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Practitioner & Facility Registry Verification</h1>
        <p className="text-xs text-slate-500">Audit and authorize clinic nodes and medical practitioner licences under PM-JAY compliance.</p>
      </div>

      {/* Filter */}
      <div className="max-w-md bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-xs">
        <Input 
          id="user-search"
          placeholder="Filter doctors by name or specialty..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doctors Verification List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Medical Officer Licences</h3>
          
          <Card>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3">Practitioner Details</th>
                      <th className="px-6 py-3">Specialty / Station</th>
                      <th className="px-6 py-3 text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {filteredDoctors.map(doc => {
                      const isVerified = verifiedDocs[doc.id];
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {doc.avatar ? (
                                <img 
                                  src={doc.avatar} 
                                  alt={doc.name} 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const fallback = document.createElement('span');
                                      fallback.className = 'text-2xl';
                                      fallback.innerText = '👨‍⚕️';
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                  className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                                />
                              ) : (
                                <span className="text-2xl">👨‍⚕️</span>
                              )}
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">UID: {doc.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-700 dark:text-slate-350">{doc.specialty}</p>
                            <p className="text-[10px] text-slate-500">🏢 {doc.facilityName}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant={isVerified ? 'success' : 'danger'} 
                              size="sm"
                              onClick={() => handleToggleVerify(doc.id)}
                              leftIcon={isVerified ? <CheckCircle className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                            >
                              {isVerified ? 'ABDM Verified' : 'Suspended'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Facilities short index */}
        <div className="space-y-4 col-span-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Hospital Node Registries</h3>
          
          <Card>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {facilities.map(fac => (
                  <div key={fac.id} className="p-4 space-y-2 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{fac.name}</span>
                      <Badge color="success">Verified</Badge>
                    </div>
                    <div className="text-[10px] text-slate-550 space-y-0.5">
                      <p>📍 {fac.location}</p>
                      <p>🔍 Class: Tier-{fac.type} facility</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

    </div>
  );
};
