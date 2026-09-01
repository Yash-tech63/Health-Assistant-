import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Send, Building2, HelpCircle, Bell } from 'lucide-react';

interface CommunicationMessage {
  id: string;
  sender: string;
  facility: string;
  text: string;
  timestamp: string;
}

export const H2HCommunication: React.FC = () => {
  const [messages, setMessages] = useState<CommunicationMessage[]>([
    {
      id: 'h2h-1',
      sender: 'Registry Desk',
      facility: 'Shimla District General Hospital',
      text: 'Requesting emergency bed check: Referral R-702 (Rajesh Kumar) issued for angiogram cathode procedure. Is ICU slot vacant?',
      timestamp: '2026-08-25T12:00:00Z'
    },
    {
      id: 'h2h-2',
      sender: 'Cath Lab Triage',
      facility: 'IGMC Specialist Hospital',
      text: 'Bed vacant in Cardiac ICU Ward. Please dispatch patient via ambulance. Digitised records synced. We are prepping Cath Lab.',
      timestamp: '2026-08-25T12:15:00Z'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: CommunicationMessage = {
      id: `h2h-${Date.now()}`,
      sender: 'Clinical Desk Staff',
      facility: 'Shimla District General Hospital',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulated reply from IGMC
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `h2h-${Date.now() + 1}`,
        sender: 'Triage Admissions Desk',
        facility: 'IGMC Specialist Hospital',
        text: 'Received message. Central registry updated. Patient record verified.',
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hospital-to-Hospital (H2H) Communication</h1>
        <p className="text-xs text-slate-500">Secure clinical chat channels connecting regional primary outposts with state medical colleges.</p>
      </div>

      <Card className="h-[500px] flex flex-col overflow-hidden">
        {/* Active Node Header */}
        <CardHeader className="bg-slate-50/50 dark:bg-slate-950/10 flex justify-between items-center py-3">
          <span className="text-xs font-bold flex items-center gap-1.5"><Building2 className="h-4.5 w-4.5 text-medical-600 animate-pulse" /> IGMC Specialist Transfer Channel</span>
          <span className="text-[10px] text-slate-400 font-semibold">Active Node Connection</span>
        </CardHeader>

        {/* Messaging Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            const isLocal = msg.facility.includes('District');
            return (
              <div key={msg.id} className={`flex ${isLocal ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs sm:max-w-xl rounded-2xl px-4 py-3 text-xs border shadow-xs ${
                  isLocal 
                    ? 'bg-medical-600 border-medical-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  <div className="flex justify-between items-center gap-4 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isLocal ? 'text-white/80' : 'text-medical-600 dark:text-medical-400'}`}>
                      {msg.facility.split(' ')[0]} {msg.sender}
                    </span>
                    <span className={`text-[8px] ${isLocal ? 'text-white/60' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 flex gap-2">
          <Input 
            id="h2h-input"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type bed reservation request or dispatch notice..."
            className="flex-1"
            autoComplete="off"
            required
          />
          <Button variant="primary" type="submit" className="px-5">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>

    </div>
  );
};
