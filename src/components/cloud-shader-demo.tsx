import React from 'react';
import { CloudShader } from './ui/cloud-shader';
import { Button } from './Button';
import { ShieldAlert, ArrowRight, HeartPulse } from 'lucide-react';

export const CloudShaderDemo: React.FC = () => {
  return (
    <CloudShader
      speed={0.6}
      count={4}
      cloudColor="#ffffff"
      skyTopColor="#0f766e"
      skyBottomColor="#e0f2fe"
      className="w-full min-h-screen flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-medical-200 dark:border-medical-800 text-medical-700 dark:text-medical-300 text-xs font-extrabold uppercase tracking-wider shadow-sm">
          <HeartPulse className="h-4 w-4 text-medical-600" />
          <span>Abhimanyu Health Assistant WebGL Preview</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
          Healthcare Support, <br />
          <span className="text-medical-700 dark:text-medical-400">Connected to Your Community</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
          Procedurally animated WebGL cloud shader background with customizable sky colors, layer counts, drift speeds, and full prefers-reduced-motion compliance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" className="flex items-center gap-2 shadow-md">
            <span>Get Started with ABHA</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="lg" className="bg-white/90 dark:bg-slate-900/90 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>Emergency Dispatch</span>
          </Button>
        </div>
      </div>
    </CloudShader>
  );
};
