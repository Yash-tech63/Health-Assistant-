import React from 'react';
import { Building2, Navigation, Clock, ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';
import { Card, CardBody } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

export interface NearestHospitalItem {
  id: string;
  name: string;
  distance: string;
  travelTime: string;
  emergencyStatus: string;
  address: string;
  phone: string;
  icuAvailable: boolean;
  tier: string;
}

const mockHospitals: NearestHospitalItem[] = [
  {
    id: 'HOSP-01',
    name: 'Shimla District General Hospital - Emergency Unit',
    distance: '2.8 km',
    travelTime: '8 min',
    emergencyStatus: '24/7 Trauma & Emergency Ready',
    address: 'Mall Road Extension, Shimla District, HP',
    phone: '+91 177 280 1234',
    icuAvailable: true,
    tier: 'District Hospital (Tier 2)',
  },
  {
    id: 'HOSP-02',
    name: 'IGMC Super-Specialist Emergency Cath Lab',
    distance: '5.4 km',
    travelTime: '15 min',
    emergencyStatus: '24/7 Cardiac & Super-Specialty ICU',
    address: 'Lakkar Bazaar, Ridge Road, Shimla, HP',
    phone: '+91 177 288 9900',
    icuAvailable: true,
    tier: 'Tertiary Specialist (Tier 3)',
  },
  {
    id: 'HOSP-03',
    name: 'Dhami Primary Emergency Health Post',
    distance: '1.2 km',
    travelTime: '4 min',
    emergencyStatus: 'First-Aid & Oxygen Triage Post',
    address: 'Main Bazaar, Dhami Village, HP',
    phone: '+91 177 274 0012',
    icuAvailable: false,
    tier: 'Primary Health Centre (Tier 1)',
  },
];

interface NearestHospitalsProps {
  onSelectHospital?: (hospital: NearestHospitalItem) => void;
  className?: string;
}

export const NearestHospitals: React.FC<NearestHospitalsProps> = ({
  onSelectHospital,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-medical-600" />
            <span>🏥 Nearest Healthcare Facilities</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified emergency centers with live bed capacity and trauma triage units.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-medical-50 dark:bg-medical-950/40 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800 text-xs font-bold self-start sm:self-auto">
          3 Nearby Facilities Detected
        </span>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockHospitals.map((hosp) => (
          <Card key={hosp.id} hoverable className="flex flex-col justify-between border-t-4 border-t-medical-500">
            <CardBody className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <Badge color={hosp.icuAvailable ? 'success' : 'info'} size="sm">
                    {hosp.tier}
                  </Badge>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    24/7 OPEN
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">
                    {hosp.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                    <span>📍</span>
                    <span>{hosp.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5" />
                    {hosp.distance}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {hosp.travelTime}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{hosp.emergencyStatus}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${hosp.phone}`}
                  className="flex-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call Desk</span>
                </a>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectHospital && onSelectHospital(hosp)}
                  className="flex-1 text-xs"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
