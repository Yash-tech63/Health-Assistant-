import React, { useState } from 'react';
import { Building2, MapPin, PhoneCall, Check, Loader2 } from 'lucide-react';
import { Card, CardBody } from '../Card';
export const EmergencyQuickActions = ({ onRequestAmbulance, onFindHospital, onShareLocation, className = '', }) => {
    const [locating, setLocating] = useState(false);
    const [locationSuccess, setLocationSuccess] = useState(null);
    const handleShareLocationClick = () => {
        setLocating(true);
        setLocationSuccess(null);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocating(false);
                const coords = `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)} (Dhami Sector 4)`;
                setLocationSuccess(coords);
                if (onShareLocation)
                    onShareLocation(coords);
            }, (error) => {
                setLocating(false);
                // Fallback mock coordinates if permission denied
                const fallback = 'Location: Dhami Primary Post, Sector 4, Shimla';
                setLocationSuccess(fallback);
                if (onShareLocation)
                    onShareLocation(fallback);
            }, { timeout: 8000 });
        }
        else {
            setLocating(false);
            const fallback = 'Location: Dhami Primary Post, Sector 4, Shimla';
            setLocationSuccess(fallback);
            if (onShareLocation)
                onShareLocation(fallback);
        }
    };
    return (<div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Emergency Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: Request Ambulance */}
        <Card hoverable onClick={onRequestAmbulance} className="border-l-4 border-l-rose-500 hover:shadow-lg transition-all group">
          <CardBody className="p-4 flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0 text-xl group-hover:scale-110 transition-transform">
              🚑
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                Request Ambulance
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Fast emergency medical dispatch to your location.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Action 2: Find Hospital */}
        <Card hoverable onClick={onFindHospital} className="border-l-4 border-l-teal-500 hover:shadow-lg transition-all group">
          <CardBody className="p-4 flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Building2 className="h-6 w-6"/>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Find Hospital
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Locate 24/7 trauma & emergency centers nearby.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Action 3: Share Location */}
        <Card hoverable onClick={handleShareLocationClick} className="border-l-4 border-l-amber-500 hover:shadow-lg transition-all group">
          <CardBody className="p-4 flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {locating ? (<Loader2 className="h-6 w-6 animate-spin text-amber-600"/>) : locationSuccess ? (<Check className="h-6 w-6 text-emerald-600"/>) : (<MapPin className="h-6 w-6"/>)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                {locating ? 'Detecting...' : locationSuccess ? 'Location Detected' : 'Share Location'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">
                {locationSuccess ? locationSuccess : 'Detect & send your live GPS position.'}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Action 4: Emergency Call */}
        <a href="tel:108" className="block group">
          <Card className="border-l-4 border-l-red-600 hover:shadow-lg transition-all bg-rose-50/40 dark:bg-rose-950/20">
            <CardBody className="p-4 flex items-start gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <PhoneCall className="h-6 w-6 animate-pulse"/>
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-600 dark:text-red-400 group-hover:underline">
                  Emergency Call (108)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Direct toll-free national health helpline.
                </p>
              </div>
            </CardBody>
          </Card>
        </a>
      </div>
    </div>);
};
