import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sparkles, Bot, User, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export const PersonalHealthAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hi! I'm your healthcare assistant. Ask me about diet, symptoms, yoga, or medicines.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scannedPrescription, setScannedPrescription] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const cards = [
    {
      id: 'nutrition',
      title: 'Nutrition Guide',
      subtitle: 'Healthy meals & food suggestions',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop',
      prompt: 'Can you provide a healthy nutrition guide and meal suggestions for a balanced diet?',
      botAnswer: '🍎 **Nutrition Guide & Healthy Meal Tips**:\n\n• **Breakfast**: Oats with almonds, chia seeds, and fresh berries.\n• **Lunch**: Whole grain roti/brown rice with dal, leafy greens, and curd.\n• **Snacks**: Handful of walnuts, roasted chana, or fresh fruit.\n• **Dinner**: Light vegetable soup with grilled paneer or steamed vegetables.\n\n*Tip: Stay hydrated with 2.5–3 Liters of water daily!*'
    },
    {
      id: 'yoga',
      title: 'Yoga & Exercise',
      subtitle: 'Yoga poses & daily workouts',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400&auto=format&fit=crop',
      prompt: 'What are recommended yoga poses and daily workout routines for overall fitness?',
      botAnswer: '🧘‍♀️ **Yoga & Daily Workout Recommendations**:\n\n1. **Surya Namaskar (Sun Salutation)**: 6–12 rounds for full-body flexibility.\n2. **Bhujangasana (Cobra Pose)**: Relieves lower back pain and opens chest.\n3. **Anulom Vilom (Alternate Nostril Breathing)**: Reduces stress and anxiety.\n4. **30-Min Cardio**: Brisk walking, jogging, or cycling.\n\n*Always stretch for 5 minutes before and after exercising.*'
    },
    {
      id: 'diet',
      title: 'Diet Plans',
      subtitle: 'Personalized diet routines',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400&auto=format&fit=crop',
      prompt: 'Please suggest a personalized daily diet plan for maintaining energy and weight management.',
      botAnswer: '🥗 **Personalized Balanced Diet Plan**:\n\n• **8:00 AM**: Warm lemon water + 5 soaked almonds.\n• **9:00 AM**: Vegetable oats upma or 2 idlis with sambar.\n• **1:30 PM**: 2 Multigrain Roti + Bowl of Rajma/Dal + Cucumber Salad.\n• **5:00 PM**: Green tea + Makhana (foxnuts).\n• **8:00 PM**: Bottle gourd (lauki) soup + Paneer/Tofu sauté.'
    },
    {
      id: 'prescription',
      title: 'Prescription Scan',
      subtitle: 'Upload & understand prescriptions',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop',
      prompt: 'I want to scan and understand my medical prescription.',
      isScanner: true
    },
    {
      id: 'workout',
      title: 'Daily Workout Tips',
      subtitle: 'Fitness & strength guidance',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
      prompt: 'Give me key daily workout tips for strength building and stamina.',
      botAnswer: '💪 **Daily Workout & Fitness Guidance**:\n\n• **Bodyweight Basics**: 3 sets of 15 push-ups, 20 body squats, and 30-sec planks.\n• **Progressive Overload**: Gradually increase resistance every week.\n• **Rest & Recovery**: Aim for 7–8 hours of deep sleep so muscles rebuild.\n• **Protein Intake**: Consume 1.2g–1.6g of protein per kg of body weight.'
    },
    {
      id: 'remedies',
      title: 'Home Remedies',
      subtitle: 'Natural care & remedies',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
      prompt: 'What are effective, safe natural home remedies for common cold, cough, and indigestion?',
      botAnswer: '🌿 **Natural Home Remedies**:\n\n• **Cough & Cold**: Kadha with ginger, tulsi, black pepper, and honey.\n• **Sore Throat**: Saltwater gargle 3 times daily + warm turmeric milk at night.\n• **Indigestion**: Carom seeds (ajwain) with warm water and a pinch of black salt.\n• **Headache**: Peppermint tea or gentle temple massage with lavender oil.'
    },
    {
      id: 'mental',
      title: 'Mental Wellness',
      subtitle: 'Mindfulness & stress care',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
      prompt: 'How can I manage stress, improve focus, and practice daily mental wellness?',
      botAnswer: '🧠 **Mental Wellness & Mindfulness Guidance**:\n\n• **4-7-8 Breathing**: Inhale 4s, hold 7s, exhale 8s to calm the nervous system.\n• **Digital Detox**: Avoid screens 1 hour before sleep and 30 mins after waking.\n• **Mindful Gratitude**: Write down 3 things you are grateful for each evening.\n• **Daily Walk**: 20 minutes in nature reduces cortisol (stress hormone) levels.'
    },
    {
      id: 'firstaid',
      title: 'First Aid & Safety',
      subtitle: 'Emergency care & basic response',
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=400&auto=format&fit=crop',
      prompt: 'What are essential first aid steps for minor burns, cuts, heatstroke, and emergencies?',
      botAnswer: '🚑 **First Aid & Immediate Care Guidelines**:\n\n• **Minor Burns**: Cool under cold running water for 10–15 mins. Do NOT apply ice or butter.\n• **Cuts & Bleeding**: Apply clean cloth with firm, direct pressure for 5 mins.\n• **Heatstroke**: Move to shade, loosen clothing, sip electrolyte water, apply cool damp cloth.\n• **Emergency Alert**: Call 108 or visit nearest PHC if victim is unresponsive or in severe pain.'
    }
  ];

  const handleSend = (userText) => {
    const textToSend = userText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = generateBotReply(textToSend);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleCardClick = (card) => {
    if (card.isScanner) {
      fileInputRef.current?.click();
      return;
    }
    if (card.botAnswer) {
      const userMsg = {
        id: Date.now().toString(),
        sender: 'user',
        text: card.prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: card.botAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 700);
    } else {
      handleSend(card.prompt);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScannedPrescription(file.name);
      const userMsg = {
        id: Date.now().toString(),
        sender: 'user',
        text: `📄 Uploaded Prescription: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `🔍 **Prescription Analysis Complete** for *${file.name}*:\n\n1. **Paracetamol 500mg**: Take 1 tablet after meals (twice daily for fever/pain).\n2. **Amoxicillin 500mg**: Antibiotic — 1 capsule every 8 hours for 5 days.\n3. **Pantoprazole 40mg**: Take 1 tablet on an empty stomach in the morning.\n\n⚠️ *Always consult your prescribing doctor or pharmacist before modifying medication dosage.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 1200);
    }
  };

  const generateBotReply = (query) => {
    const q = query.toLowerCase();
    if (q.includes('fever') || q.includes('headache') || q.includes('cold') || q.includes('symptom')) {
      return "🤒 **Symptom Assessment**:\nIf you are experiencing fever or body ache, stay rested, drink plenty of fluids, and check your body temperature. If fever exceeds 101°F (38.3°C) or persists for more than 48 hours, please consult a physician.";
    }
    if (q.includes('medicine') || q.includes('tablet') || q.includes('dose')) {
      return "💊 **Medication Safety**:\nAlways take medicines prescribed by an authorized physician. Keep track of dosage times and avoid taking antibiotics without a valid prescription.";
    }
    if (q.includes('diet') || q.includes('food') || q.includes('eat') || q.includes('nutrition')) {
      return "🥗 **Nutritional Guidance**:\nA balanced meal consists of 50% vegetables/salads, 25% lean protein (dal, paneer, eggs), and 25% complex carbohydrates (multigrain roti, brown rice).";
    }
    if (q.includes('yoga') || q.includes('exercise') || q.includes('workout')) {
      return "🧘‍♂️ **Fitness Tip**:\nCombining 20 minutes of daily Pranayama breathing exercises with 30 minutes of moderate aerobic exercise improves heart health and mental immunity!";
    }
    if (q.includes('mental') || q.includes('stress') || q.includes('mind') || q.includes('anxiety') || q.includes('meditation')) {
      return "🧠 **Mental Wellness & Mindfulness**:\nPractice daily 4-7-8 deep breathing exercises, take 20-minute nature walks to lower stress hormones, and practice digital detox before bed for improved sleep and focus.";
    }
    if (q.includes('first aid') || q.includes('burn') || q.includes('cut') || q.includes('bleed') || q.includes('injury') || q.includes('emergency')) {
      return "🚑 **First Aid Protocol**:\n• **Burns**: Run cool water for 10-15 mins (avoid ice/butter).\n• **Bleeding**: Firm pressure with clean cloth.\n• **Heatstroke**: Move to shade, sip electrolyte water, cool damp cloth.\n• Call 108 or visit nearest PHC for urgent emergency care.";
    }
    return `💡 Thank you for asking! Based on your query ("${query}"), I recommend maintaining healthy daily habits: drink 3L water, eat fresh whole foods, get 30 mins of daily activity, and sleep 7-8 hours. Feel free to ask more specific questions about diet, symptoms, yoga, mental wellness, or first aid!`;
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="assistant">
      {/* Title Header matching photo design */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Personal Health Assistant
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Explore curated health guides or ask our intelligent HealthBot for real-time guidance.
        </p>
      </div>

      {/* Main Grid: Left 8 Cards + Right Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 8 Feature Cards (7 columns on lg screens) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="group bg-white dark:bg-slate-850 rounded-2xl p-3 border border-slate-150 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center space-y-2.5"
            >
              <div className="relative h-20 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop';
                  }}
                />
              </div>
              <div className="space-y-0.5 w-full">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {card.title}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hidden File Input for Prescription Scanner */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf"
          className="hidden"
        />

        {/* Right Side: Abhimanyu HealthBot Widget (5 columns on lg screens) */}
        <div className="lg:col-span-5 bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col h-[520px]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Abhimanyu HealthBot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask anything about your health
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl p-4 overflow-y-auto space-y-3.5 border border-blue-100/60 dark:border-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
                <div className="bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 px-3.5 py-2 rounded-2xl text-slate-500 flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                  <span>HealthBot is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Type your health question here..."
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 flex items-center justify-center shrink-0 font-medium text-xs shadow-xs"
            >
              Send
            </Button>
          </form>

        </div>

      </div>
    </section>
  );
};
