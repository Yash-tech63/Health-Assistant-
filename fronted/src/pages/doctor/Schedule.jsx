import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
export const Schedule = () => {
    const [weeklyAvailability, setWeeklyAvailability] = useState([
        { day: 'Monday', hours: '02:00 PM - 06:00 PM', active: true },
        { day: 'Tuesday', hours: '10:00 AM - 02:00 PM', active: true },
        { day: 'Wednesday', hours: 'Unavailable', active: false },
        { day: 'Thursday', hours: '10:00 AM - 02:00 PM', active: true },
        { day: 'Friday', hours: '02:00 PM - 06:00 PM', active: true }
    ]);
    const toggleDayAvailability = (index) => {
        setWeeklyAvailability(prev => prev.map((item, idx) => {
            if (idx === index)
                return { ...item, active: !item.active, hours: !item.active ? '10:00 AM - 02:00 PM' : 'Unavailable' };
            return item;
        }));
    };
    const handleSave = () => {
        alert('Practice schedule has been updated on the Central Registry.');
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Availability Management</h1>
        <p className="text-xs text-slate-500">Configure your hospital OPD blocks and telehealth chat availability blocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side Info */}
        <Card className="col-span-1 border-t-4 border-t-medical-500">
          <CardBody className="space-y-4 text-xs">
            <span className="font-bold flex items-center gap-1.5"><Calendar className="h-4.5 w-4.5 text-medical-600"/> Clinic OPD Allocation</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Define your physical OPD consultation hours. Patients using the swasthya platform check this list live when booking appointments or scheduling referrals.
            </p>
          </CardBody>
        </Card>

        {/* Schedule settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Availability Week Planner</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {weeklyAvailability.map((item, idx) => (<div key={idx} className="py-3 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.day}</span>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3"/> {item.hours}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => toggleDayAvailability(idx)} className={`px-3 py-1 rounded-lg border text-[10px] font-bold ${item.active
                ? 'border-hospital-500 text-hospital-600 bg-hospital-50 dark:bg-hospital-950/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                      {item.active ? 'OPD Active' : 'Off-duty'}
                    </button>
                  </div>
                </div>))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="primary" onClick={handleSave} leftIcon={<CheckCircle className="h-4 w-4"/>}>
                Save Changes
              </Button>
            </div>

          </CardBody>
        </Card>

      </div>

    </div>);
};
