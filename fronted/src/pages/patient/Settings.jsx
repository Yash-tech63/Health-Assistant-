import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Globe, Sun, Moon, Shield, Info } from 'lucide-react';
import { Button } from '../../components/Button';
export const Settings = () => {
    const { user } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    return (<div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Portal Settings</h1>
        <p className="text-xs text-slate-500">Configure language, themes, and check security linkages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile overview */}
        <Card className="col-span-1">
          <CardBody className="space-y-4 text-center">
            {user?.avatar && user.avatar.startsWith('http') ? (<img src={user.avatar} alt={user.name} onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'text-4xl bg-emerald-50 dark:bg-emerald-950/40 p-4 h-24 w-24 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-900 shrink-0 font-bold text-emerald-700 dark:text-emerald-300 mx-auto';
                    fallback.innerText = '👨‍🌾';
                    parent.appendChild(fallback);
                }
            }} className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500 shadow-md mx-auto"/>) : (<div className="text-4xl mx-auto bg-emerald-50 dark:bg-emerald-950/40 p-4 h-24 w-24 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-900 font-bold text-emerald-700 dark:text-emerald-300">
                👨‍🌾
              </div>)}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <Badge color="primary">ABHA Active</Badge>
            </div>
          </CardBody>
        </Card>

        {/* Global Settings options */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Security & General Configuration</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            
            {/* Language toggle */}
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-850">
              <div className="space-y-0.5">
                <span className="font-bold text-xs flex items-center gap-1.5"><Globe className="h-4 w-4 text-slate-400"/> Interface Language</span>
                <p className="text-[10px] text-slate-500">Choose between English and regional Hindi translation systems.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
                Active: {language === 'en' ? 'English' : 'हिंदी'}
              </Button>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-850">
              <div className="space-y-0.5">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  {theme === 'dark' ? <Moon className="h-4 w-4 text-slate-400"/> : <Sun className="h-4 w-4 text-slate-400"/>}
                  Theme Mode
                </span>
                <p className="text-[10px] text-slate-500">Toggle dark mode themes for clinical display comfort.</p>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>

            {/* Consent registry */}
            <div className="flex justify-between items-center py-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs flex items-center gap-1.5"><Shield className="h-4 w-4 text-slate-400"/> Consent Manager</span>
                <p className="text-[10px] text-slate-500">View and audit doctor requests to view your digital health data.</p>
              </div>
              <Button variant="secondary" size="sm">Manage Consents</Button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl flex gap-2.5">
              <Info className="h-5 w-5 text-medical-600 flex-shrink-0"/>
              <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
                Your medical files are encrypted under Ayushman Bharat digital guidelines. No doctor or diagnostic clinic can query your record without an OTP generated consent token.
              </p>
            </div>

          </CardBody>
        </Card>

      </div>

    </div>);
};
