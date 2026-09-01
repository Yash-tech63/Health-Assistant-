import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Bot, Send, ArrowRight, HelpCircle, Activity } from 'lucide-react';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export const HealthAssistChatbot: React.FC = () => {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'bot-1',
      sender: 'bot',
      text: 'Namaste! I am HealthAssist AI, your digital health helper. You can ask me about symptoms (e.g., chest pain, fever, maternal health) or retrieve information on the Ayushman Bharat PM-JAY scheme.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const promptChips = [
    { label: 'Chest Pain Symptoms', query: 'I have chest pain and breathlessness. What should I do?' },
    { label: 'High Fever Help', query: 'I have high fever for 3 days. Where should I go?' },
    { label: 'AB-PMJAY Scheme Details', query: 'Tell me about the Ayushman Bharat PM-JAY scheme benefits.' },
    { label: 'Maternal Follow-ups', query: 'I am pregnant. What health monitoring is available?' }
  ];

  const handleBotResponse = (query: string) => {
    let reply = "I am processing your query. Under our guidelines, please visit your nearest Primary Health Centre (PHC) for a clinical checkup.";
    const lowercase = query.toLowerCase();

    if (lowercase.includes('chest pain') || lowercase.includes('breathless') || lowercase.includes('heart') || lowercase.includes('cardiac')) {
      reply = `⚠️ **URGENT MEDICAL ASSESSMENT RECOMMENDATION**
1. **First Step:** Immediately visit your nearest Primary Health Centre (PHC) or District Hospital emergency desk. Do not drive yourself.
2. **Clinical Action:** The medical officer will perform an immediate ECG test. 
3. **Workflow Journey:** If ECG abnormalities indicate cardiac distress, you will receive a digital referral ticket to a District Hospital (Level 2) or Super-Specialist Hospital (Level 3) like IGMC Shimla Cath Lab for immediate coronary angiography.`;
    } else if (lowercase.includes('fever') || lowercase.includes('malaria') || lowercase.includes('dengue')) {
      reply = `🤒 **FEVER CLINIC PROTOCOL**
1. **Where to go:** Visit your local Primary Health Centre (PHC). 
2. **Services Available:** PHC labs offer free blood smear testing for malaria, rapid diagnostics for dengue, and paracetamol distribution.
3. **Escalation:** If fever persists with severe complications (e.g., platelet drop below 50,000), the PHC doctor will transfer you to the District Community Health Centre (CHC) for iv fluids and monitoring.`;
    } else if (lowercase.includes('pm-jay') || lowercase.includes('pmjay') || lowercase.includes('ayushman bharat') || lowercase.includes('insurance')) {
      reply = `💳 **AYUSHMAN BHARAT PM-JAY SCHEME DETAILS**
- **Coverage:** Provides free health insurance cover of up to **₹5,00,000 per family per year** for secondary and tertiary care hospitalization.
- **Cashless benefit:** Fully cashless treatments at all government empanelled and select private hospitals across India.
- **How to claim:** Present your **ABHA ID / Ayushman Card** at the hospital 'Ayushman Mitra' helpdesk during admission.`;
    } else if (lowercase.includes('pregnant') || lowercase.includes('maternal') || lowercase.includes('delivery')) {
      reply = `🤰 **MATERNAL HEALTH RECOMMENDATIONS**
- **Antenatal Care (ANC):** Scheduled ANC follow-ups are available at Sunni Community Health Centre (CHC) or your local ASHA worker/PHC clinic.
- **Benefits:** Free iron-folic acid pills, tetanus toxoid injections, and routine fetal screening.
- **Scheme benefit:** Under Janani Suraksha Yojana (JSY), cash assistance is provided for institutional delivery at certified health centres.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date()
      }]);
      setLoading(false);
    }, 1000);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // User Message
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    handleBotResponse(textToSend);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl flex items-center justify-center">
          <Bot className="h-6 w-6 animate-bounce" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">HealthAssist AI Chatbot</h1>
          <p className="text-xs text-slate-500">Instant AI symptoms support desk and scheme eligibility guides.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Chat Window */}
        <Card className="lg:col-span-3 h-[520px] flex flex-col overflow-hidden">
          {/* Chat header */}
          <CardHeader className="bg-slate-50/50 dark:bg-slate-950/10 flex justify-between items-center py-3">
            <span className="text-xs font-bold flex items-center gap-1.5"><Activity className="h-4 w-4 text-emerald-500" /> Live AI Engine</span>
            <span className="text-[10px] text-slate-400 font-medium">ABDM Digital Assistant</span>
          </CardHeader>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(m => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs sm:max-w-xl rounded-2xl px-4 py-2.5 text-xs border shadow-xs ${
                    isBot 
                      ? 'bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none' 
                      : 'bg-medical-600 border-medical-600 text-white rounded-br-none'
                  }`}>
                    {/* Render markdown style line breaks simple replacement */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {m.text}
                    </div>
                    <span className={`block text-[8px] mt-1.5 text-right ${isBot ? 'text-slate-400' : 'text-white/60'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 rounded-bl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Chat input footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }} 
            className="p-4 border-t border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 flex gap-2"
          >
            <Input 
              id="chatbot-input"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask about chest pain, high fever, or Ayushman card benefits..."
              className="flex-1"
              autoComplete="off"
              required
            />
            <Button variant="primary" type="submit" className="px-5">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        {/* Quick query sidebar */}
        <div className="space-y-4 col-span-1">
          <h3 className="font-bold text-xs uppercase text-slate-400 block tracking-wider">Suggested Queries</h3>
          
          <div className="space-y-3">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-semibold hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex items-start justify-between gap-2"
              >
                <span className="text-slate-800 dark:text-slate-200 leading-snug">{chip.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
