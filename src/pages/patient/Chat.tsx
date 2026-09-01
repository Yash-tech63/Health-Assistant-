import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Send, User, MessageSquare } from 'lucide-react';

export const Chat: React.FC = () => {
  const { messages, sendMessage, doctors } = useHealthStore();
  const [activeDoctorId, setActiveDoctorId] = useState('D-205'); // Dr. Arvind Sharma by default
  const [inputText, setInputText] = useState('');

  const patientId = 'P-101'; // Rajesh Kumar
  const activeDoctor = doctors.find(d => d.id === activeDoctorId);

  // Filter messages for active chat
  const chatMessages = messages.filter(m => 
    (m.senderId === patientId && m.receiverId === activeDoctorId) ||
    (m.senderId === activeDoctorId && m.receiverId === patientId)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeDoctor) return;

    sendMessage(patientId, 'Rajesh Kumar', activeDoctorId, inputText.trim());
    setInputText('');

    // Simulate quick auto-reply from doctor for interactive demonstration
    setTimeout(() => {
      sendMessage(
        activeDoctorId,
        activeDoctor.name,
        patientId,
        "Dhanyawaad for your message. I have logged this check in your E-Record. We will review this during our follow-up consultation."
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Doctor Communication Chat</h1>
        <p className="text-xs text-slate-500">Secure tele-consultation support chat linked with verified medical practitioners.</p>
      </div>

      <Card className="h-[550px] flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 h-full divide-x divide-slate-100 dark:divide-slate-850">
          
          {/* Doctors list */}
          <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/20 col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-2">My Practitioners</span>
            
            {doctors.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDoctorId(doc.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                  activeDoctorId === doc.id
                    ? 'border-medical-500 bg-medical-50/50 dark:bg-medical-950/10'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-base flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  👨‍⚕️
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-850 dark:text-slate-100 truncate">{doc.name}</p>
                  <p className="text-[9px] text-slate-450 truncate">{doc.specialty}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex flex-col col-span-3 h-full">
            {activeDoctor ? (
              <>
                {/* Active Chat Header */}
                <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeDoctor.name}</h3>
                    <p className="text-[10px] text-slate-500">🏢 {activeDoctor.facilityName}</p>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-medical-600 dark:text-medical-455 tracking-wider bg-medical-50 dark:bg-medical-950/20 border border-medical-200 dark:border-medical-900 px-2 py-0.5 rounded-full">Secure ABDM Chat</span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map(msg => {
                    const isSelf = msg.senderId === patientId;
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs border ${
                          isSelf 
                            ? 'bg-medical-600 border-medical-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className={`block text-[9px] mt-1.5 text-right ${isSelf ? 'text-white/60' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {chatMessages.length === 0 && (
                    <div className="text-center py-20 text-slate-400 text-xs">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-350" />
                      <p>Start a secure consultation thread with {activeDoctor.name}.</p>
                    </div>
                  )}
                </div>

                {/* Input Footer */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 flex gap-2">
                  <Input 
                    id="chat-text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type message here..."
                    className="flex-1"
                    autoComplete="off"
                    required
                  />
                  <Button variant="primary" type="submit" className="px-5">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-slate-400 text-xs">
                <User className="h-10 w-10 text-slate-350 mb-2" />
                <p>Select a practitioner to display communication records.</p>
              </div>
            )}
          </div>

        </div>
      </Card>

    </div>
  );
};
