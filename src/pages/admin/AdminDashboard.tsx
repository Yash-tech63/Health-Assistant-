import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { 
  ShieldCheck, Users, Stethoscope, Building, ClipboardCheck, 
  Siren, Clock, Search, MapPin, Activity, CheckCircle, AlertCircle, Phone 
} from 'lucide-react';
import { initialAmbulances, AmbulanceUnit } from '../../data/mockData';

type AdminTab = 'patients' | 'doctors' | 'hospitals' | 'ambulances' | 'activities';

export const AdminDashboard: React.FC = () => {
  const { patients, doctors, facilities, referrals, auditLogs } = useHealthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ambulances state
  const [ambulances] = useState<AmbulanceUnit[]>(initialAmbulances);

  // Filtered queries
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.abhaId.includes(searchTerm)
  );

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAmbulances = ambulances.filter(a => 
    a.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) || a.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || a.stationFacilityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || l.details.toLowerCase().includes(searchTerm.toLowerCase()) || l.actorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Central Admin Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-xs">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span>National Health Registry Admin Command</span>
          </h1>
          <p className="text-xs text-slate-300">
            Sector: <strong className="text-white">Ayushman Bharat Digital Mission (ABDM)</strong> | Central Admin Hub
          </p>
        </div>
        <Badge color="success" className="py-1 px-3 text-xs">
          🟢 National Health Grid Live
        </Badge>
      </div>

      {/* Aggregate Command Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${activeTab === 'patients' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('patients')}
        >
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">ABHA Patients</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{patients.length} Registered</h3>
            </div>
            <Users className="h-6 w-6 text-emerald-600 hidden sm:block" />
          </CardBody>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${activeTab === 'doctors' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('doctors')}
        >
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Doctors</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{doctors.length} Verified</h3>
            </div>
            <Stethoscope className="h-6 w-6 text-sky-500 hidden sm:block" />
          </CardBody>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${activeTab === 'hospitals' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('hospitals')}
        >
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hospitals</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{facilities.length} Nodes</h3>
            </div>
            <Building className="h-6 w-6 text-teal-600 hidden sm:block" />
          </CardBody>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${activeTab === 'ambulances' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('ambulances')}
        >
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">108 Ambulances</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{ambulances.length} Active Fleet</h3>
            </div>
            <Siren className="h-6 w-6 text-rose-500 hidden sm:block" />
          </CardBody>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${activeTab === 'activities' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('activities')}
        >
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Activities Recorded</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{auditLogs.length} Events</h3>
            </div>
            <ClipboardCheck className="h-6 w-6 text-amber-500 hidden sm:block" />
          </CardBody>
        </Card>
      </div>

      {/* Interactive Command Center Navigation Tabs & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'patients' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Users className="h-4 w-4" /> Patient Details
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'doctors' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="h-4 w-4" /> Doctor Details
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'hospitals' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Building className="h-4 w-4" /> Hospital Details
          </button>
          <button
            onClick={() => setActiveTab('ambulances')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ambulances' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <Siren className="h-4 w-4 text-rose-300" /> Ambulance Details
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'activities' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" /> Record All Activities
          </button>
        </div>

        {/* Global Search */}
        <div className="w-full md:w-64">
          <Input
            id="admin-search"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Tab 1: PATIENT DETAILS */}
      {activeTab === 'patients' && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Patient ABHA Registry Details</h3>
              <p className="text-xs text-slate-500">Query digital health card numbers, assigned PHC posts, and active referrals</p>
            </div>
            <Badge color="primary">{filteredPatients.length} Patients</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Patient Profile</th>
                    <th className="px-6 py-3">ABHA Card ID</th>
                    <th className="px-6 py-3">Blood Type & Gender</th>
                    <th className="px-6 py-3">Location Node</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <span className="text-2xl">👨‍🌾</span>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-500">{p.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.abhaId}</td>
                      <td className="px-6 py-4">
                        <Badge color="secondary">{p.bloodGroup.replace('Pos', ' +')}</Badge>
                        <span className="ml-2 text-slate-500">{p.age} Yrs / {p.gender}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.location}</td>
                      <td className="px-6 py-4">
                        <Badge color="success">Verified ABHA</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 2: DOCTOR DETAILS */}
      {activeTab === 'doctors' && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Verified Practitioner Licensing Details</h3>
              <p className="text-xs text-slate-500">ABDM medical license records, ratings, and facility linkages</p>
            </div>
            <Badge color="success">{filteredDoctors.length} Doctors</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Practitioner</th>
                    <th className="px-6 py-3">Specialty</th>
                    <th className="px-6 py-3">Assigned Hospital Station</th>
                    <th className="px-6 py-3">Rating</th>
                    <th className="px-6 py-3">License Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredDoctors.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {d.avatar ? (
                            <img src={d.avatar} alt={d.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <span className="text-2xl">👨‍⚕️</span>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{d.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">UID: {d.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{d.specialty}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{d.facilityName}</td>
                      <td className="px-6 py-4 font-bold text-amber-500 font-mono">⭐ {d.rating} / 5.0</td>
                      <td className="px-6 py-4">
                        <Badge color="success">ABDM Certified</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 3: HOSPITAL DETAILS */}
      {activeTab === 'hospitals' && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Hospital Facility & Live Bed Telemetry</h3>
              <p className="text-xs text-slate-500">Live bed availability, tier classifications, and hospital node registry</p>
            </div>
            <Badge color="info">{filteredFacilities.length} Health Nodes</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Facility Name</th>
                    <th className="px-6 py-3">Tier Classification</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Live Bed Telemetry</th>
                    <th className="px-6 py-3">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredFacilities.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {f.image ? (
                            <img src={f.image} alt={f.name} className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <span className="text-2xl">🏥</span>
                          )}
                          <p className="font-bold text-slate-900 dark:text-white">{f.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color="primary">Tier-{f.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{f.location}</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {f.bedsAvailable} Available / {f.totalBeds} Total Beds
                      </td>
                      <td className="px-6 py-4">
                        <Badge color="success">24/7 EMR Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 4: AMBULANCE DETAILS */}
      {activeTab === 'ambulances' && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Siren className="h-5 w-5 text-rose-500" /> Emergency 108 Fleet Details
              </h3>
              <p className="text-xs text-slate-500">Live GPS dispatch status, drivers, vehicle numbers, and emergency transit tracking</p>
            </div>
            <Badge color="danger">{filteredAmbulances.length} Units Active</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Vehicle Number</th>
                    <th className="px-6 py-3">Unit Type</th>
                    <th className="px-6 py-3">Driver & Contact</th>
                    <th className="px-6 py-3">Station Facility</th>
                    <th className="px-6 py-3">Dispatch Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredAmbulances.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4 font-mono font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-xl">🚑</span>
                        <span>{a.vehicleNo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={a.type.includes('ALS') ? 'danger' : 'primary'}>{a.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{a.driverName}</p>
                        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {a.driverPhone}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{a.stationFacilityName}</td>
                      <td className="px-6 py-4">
                        {a.status === 'Dispatched' ? (
                          <div className="space-y-1">
                            <Badge color="danger" className="animate-pulse">🚨 Dispatched ({a.etaMins} mins ETA)</Badge>
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{a.activePatientName}</p>
                          </div>
                        ) : a.status === 'En-Route Hospital' ? (
                          <div className="space-y-1">
                            <Badge color="warning">🔄 Transit to Hospital ({a.etaMins} mins)</Badge>
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{a.activePatientName}</p>
                          </div>
                        ) : (
                          <Badge color="success">🟢 Station Ready</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 5: RECORD ALL ACTIVITIES */}
      {activeTab === 'activities' && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-600" /> Record All System Activities (Audit Trail)
              </h3>
              <p className="text-xs text-slate-500">Real-time immutable log recording all patient, doctor, hospital, and emergency actions</p>
            </div>
            <Badge color="primary">{filteredLogs.length} Events Logged</Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Recorded Action</th>
                    <th className="px-6 py-3">Actor & Role</th>
                    <th className="px-6 py-3">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <Badge color={log.action.includes('Emergency') || log.action.includes('Dispatch') ? 'danger' : 'primary'}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{log.actorName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{log.actorRole}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  );
};
