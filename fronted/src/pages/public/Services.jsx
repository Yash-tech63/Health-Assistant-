import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { 
  Stethoscope, Play, Search, ShoppingBag, Check, Truck, 
  ShieldCheck, RefreshCw, ChevronRight, X, HeartPulse, 
  Activity, ArrowRightLeft, DollarSign, Calendar
} from 'lucide-react';
import { TreatmentVideoModal, treatmentVideosList } from '../../components/media/TreatmentVideoModal';

export const Services = () => {
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedVidId, setSelectedVidId] = useState('VID-01');

    // Marketplace Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    // Modal states
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [selectedEquipmentAction, setSelectedEquipmentAction] = useState('Buy');
    const [labTestModalOpen, setLabTestModalOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

    const serviceCategories = [
        {
            title: 'Primary Health Care & Wellness',
            tier: 'Level 1: Rural PHC',
            items: [
                'Outpatient Department (OPD) General Consultation',
                'National Immunization Program & Vaccine Drives',
                'Maternal & Antenatal Health Checks',
                'Basic Diagnostic Screening (ECG, Glucose, Hb)',
                'Distribution of essential generic medicines'
            ]
        },
        {
            title: 'Secondary Specialised Care',
            tier: 'Level 2: District Hospital',
            items: [
                'Pediatric, Orthopedic & Gynaecologic Specialties',
                'Advanced Diagnostic Labs (2D Echocardiogram, X-Ray)',
                'Operation Theatres for Minor Surgeries',
                'Inpatient Admission Ward & Emergency Beds',
                'Hospital to Hospital Transfer & Referral Coordination'
            ]
        },
        {
            title: 'Tertiary Critical Care',
            tier: 'Level 3: Specialty Hospital',
            items: [
                'Interventional Cardiology & Cath Lab Procedures',
                'Neurosciences & Complex Neurosurgery Wards',
                'Nephrology, Dialysis & Kidney Transplant Care',
                'Oncology & Cancer Radiotherapy Departments',
                'Intensive Care Units (ICU, NICU, PICU)'
            ]
        }
    ];

    // Sample Medicines & Substitutes list
    const medicinesList = [
        { id: 1, name: 'Paracetamol 650mg', category: 'Fever & Pain', brandPrice: 40, price: 20, discount: '50% OFF', substitute: 'Dolo-650 Generic' },
        { id: 2, name: 'Amoxicillin 500mg', category: 'Antibiotic', brandPrice: 120, price: 60, discount: '50% OFF', substitute: 'Mox 500 Generic' },
        { id: 3, name: 'Pantoprazole 40mg', category: 'Acidity & Digestion', brandPrice: 110, price: 55, discount: '50% OFF', substitute: 'Pan 40 Generic' },
        { id: 4, name: 'Metformin 500mg', category: 'Diabetes Care', brandPrice: 70, price: 35, discount: '50% OFF', substitute: 'Glycomet Generic' },
        { id: 5, name: 'Atorvastatin 10mg', category: 'Cholesterol & Heart', brandPrice: 160, price: 80, discount: '50% OFF', substitute: 'Atorva Generic' },
        { id: 6, name: 'Voglibose 0.2mg', category: 'Diabetes Care', brandPrice: 90, price: 45, discount: '50% OFF', substitute: 'Voglitor Generic' },
    ];

    // Medical Equipments list
    const equipmentItems = [
        { id: 1, name: 'Foldable Lightweight Wheelchair', buyPrice: 4999, rentPrice: 199, rating: '4.8★', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=300&auto=format&fit=crop' },
        { id: 2, name: 'Medical Oxygen Concentrator 5L/min', buyPrice: 28999, rentPrice: 799, rating: '4.9★', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=300&auto=format&fit=crop' },
        { id: 3, name: 'Automatic Digital BP Monitor', buyPrice: 1499, rentPrice: 99, rating: '4.7★', image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?q=80&w=300&auto=format&fit=crop' },
        { id: 4, name: 'Pulse Oximeter & Heart Rate Monitor', buyPrice: 799, rentPrice: 49, rating: '4.8★', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop' },
    ];

    // Home Diagnostics list
    const labPackages = [
        { id: 1, title: 'Full Body Health Checkup', tests: '63 Parameters (CBC, Kidney, Liver, Lipid, Sugar)', price: 999, originalPrice: 2499, discount: '60% OFF' },
        { id: 2, title: 'Diabetes Management Panel', tests: 'HbA1c, Fasting Blood Sugar, Lipid Profile, Creatinine', price: 499, originalPrice: 1200, discount: '58% OFF' },
        { id: 3, title: 'Cardiac Wellness Screening', tests: 'ECG Home Setup, Lipid Profile, Troponin-I, CRP', price: 1299, originalPrice: 3000, discount: '56% OFF' },
    ];

    const handleAddToCart = (name) => {
        setCartCount(prev => prev + 1);
        setOrderSuccessMsg(`Added ${name} to your order!`);
        setTimeout(() => setOrderSuccessMsg(''), 3000);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge color="info" className="px-3 py-1 text-xs">
            🏥 Abhimanyu Healthcare Services & Equipment
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Medicines, Equipment & Services Marketplace
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Order genuine medicines at 50% discount, buy/rent certified medical equipment, book lab tests at home, or access hospital care tiers.
          </p>
        </div>

        {/* 🔍 TOP SEARCH BAR (Matching Reference Photo) */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
            <div className="flex-1 flex items-center gap-2 px-3 w-full">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, equipment, wheel chair, BP monitor..."
                className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none py-2"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => setMedicineModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm w-full sm:w-auto"
            >
              Search
            </Button>
          </div>

          {cartCount > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
              <span className="font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                {cartCount} item(s) added to cart!
              </span>
              <button onClick={() => setMedicineModalOpen(true)} className="underline font-extrabold">
                View Cart & Checkout ➔
              </button>
            </div>
          )}

          {orderSuccessMsg && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl p-2.5 text-xs text-center font-bold animate-fade-in">
              {orderSuccessMsg}
            </div>
          )}
        </div>

        {/* 📸 TWO FEATURED CARDS SECTION (MATCHING PHOTO EXACTLY) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT BANNER CARD (Flat 50% OFF) */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between relative overflow-hidden group">
            {/* Background Accent Circle */}
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-block bg-blue-900/40 border border-blue-300/30 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                Limited Time Offer
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  Flat <span className="text-amber-300 drop-shadow-sm">50% OFF</span>
                </h2>
                <p className="text-base sm:text-lg font-medium text-blue-100">
                  on Medicines & Substitutes
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm font-medium text-blue-50 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0 stroke-[3]" />
                  <span>Genuine Medicines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0 stroke-[3]" />
                  <span>Verified Sellers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0 stroke-[3]" />
                  <span>Fast Delivery</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setMedicineModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm group-hover:scale-105"
              >
                <span>Shop Medicines</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* RIGHT CARD (Medical Equipment Services) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Medical Equipment Services
              </h3>

              {/* 2x2 Grid of Action Items */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Buy */}
                <div
                  onClick={() => {
                    setSelectedEquipmentAction('Buy');
                    setEquipmentModalOpen(true);
                  }}
                  className="bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl cursor-pointer transition-all space-y-1 text-center group"
                >
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Buy
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    New & certified equipment
                  </p>
                </div>

                {/* Rent */}
                <div
                  onClick={() => {
                    setSelectedEquipmentAction('Rent');
                    setEquipmentModalOpen(true);
                  }}
                  className="bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl cursor-pointer transition-all space-y-1 text-center group"
                >
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Rent
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Wheelchairs, oxygen & more
                  </p>
                </div>

                {/* Sell */}
                <div
                  onClick={() => {
                    setSelectedEquipmentAction('Sell');
                    setEquipmentModalOpen(true);
                  }}
                  className="bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl cursor-pointer transition-all space-y-1 text-center group"
                >
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Sell
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Sell unused equipment
                  </p>
                </div>

                {/* Exchange */}
                <div
                  onClick={() => {
                    setSelectedEquipmentAction('Exchange');
                    setEquipmentModalOpen(true);
                  }}
                  className="bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl cursor-pointer transition-all space-y-1 text-center group"
                >
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Exchange
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Upgrade old equipment
                  </p>
                </div>

              </div>
            </div>

            <div>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedEquipmentAction('Buy');
                  setEquipmentModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl w-full sm:w-auto text-sm"
              >
                Browse Equipments
              </Button>
            </div>

          </div>

        </div>

        {/* 🌟 EXTRA FEATURES SECTION (Requested Additional Features) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Additional Essential Services
            </h2>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              Featured Services
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Diagnostic Lab Tests at Home */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-bold">
                🧪
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                  Home Collection
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Diagnostic Lab Tests at Home
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Book blood tests & health checkup panels with certified phlebotomist sample collection at your doorstep.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLabTestModalOpen(true)}
                className="w-full text-xs font-bold"
              >
                Book Lab Test (60% OFF)
              </Button>
            </div>

            {/* Feature 2: 24/7 Home Nursing & Elder Care */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
                🩺
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Certified Caregivers
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Home Nursing & Elder Care
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Qualified nurses for post-surgery care, wound dressing, catheter change, and daily elderly health monitoring.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOrderSuccessMsg('Home Nurse Request logged! Care coordinator will call back within 15 minutes.');
                  setTimeout(() => setOrderSuccessMsg(''), 4000);
                }}
                className="w-full text-xs font-bold"
              >
                Request Nurse Visit
              </Button>
            </div>

            {/* Feature 3: E-Prescription Generic Substitute Finder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold">
                💊
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  Save 50% On Medicines
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Generic Substitute Matcher
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your prescription or type branded medicines to find bioequivalent generic substitutes at half price.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMedicineModalOpen(true)}
                className="w-full text-xs font-bold"
              >
                Find Generic Substitutes
              </Button>
            </div>

          </div>
        </div>

        {/* HEALTHCARE SERVICE CATALOG (TIER LEVEL 1 - 3) */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Public Healthcare Tier Infrastructure
            </h2>
            <p className="text-xs text-slate-500">
              Access specialized procedures based on Ayushman Bharat digital referral pathways.
            </p>
          </div>

          <div className="space-y-6">
            {serviceCategories.map((cat, idx) => (
              <Card key={idx} className="border-l-4 border-l-blue-600">
                <CardHeader className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{cat.title}</h3>
                  <span className="text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 border border-blue-200 dark:border-blue-900 rounded-full font-bold">
                    {cat.tier}
                  </span>
                </CardHeader>
                <CardBody>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.items.map((item, idy) => (
                      <li key={idy} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                        <Stethoscope className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* 3D & Video Medical Treatment Demonstration Protocols */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge color="success" className="px-3 py-1 text-xs">
              🎥 Interactive 3D & Video Clinical Demonstrations
            </Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Watch How Doctors Treat Patients Step-by-Step
            </h2>
            <p className="text-xs text-slate-500">
              Interactive 3D video procedural guides demonstrating primary PHC consultations, 2D Echocardiograms, Cath Lab Angiography, and 108 Ambulance Triage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentVideosList.map((v) => (
              <Card key={v.id} className="hover:shadow-lg transition-all group overflow-hidden border-slate-200 dark:border-slate-800">
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img src={v.posterUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"/>
                  <button onClick={() => {
                    setSelectedVidId(v.id);
                    setVideoModalOpen(true);
                  }} className="absolute inset-0 flex items-center justify-center bg-slate-950/30 hover:bg-slate-950/10 transition-all">
                    <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 fill-white ml-0.5"/>
                    </div>
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-[10px]">
                    <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">{v.category}</span>
                    <span className="font-mono">{v.duration}</span>
                  </div>
                </div>

                <CardBody className="space-y-2 p-4">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight line-clamp-2">{v.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{v.description}</p>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedVidId(v.id);
                    setVideoModalOpen(true);
                  }} className="w-full text-xs font-bold mt-2">
                    Watch 3D Treatment Guide
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* 🛒 MODAL 1: MEDICINES SHOP & SUBSTITUTES MODAL */}
        {medicineModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>💊 Genuine Medicines Store</span>
                    <span className="text-xs bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">Flat 50% OFF</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order genuine medicines or choose high-quality generic substitutes.
                  </p>
                </div>
                <button onClick={() => setMedicineModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {medicinesList.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900 dark:text-white">{m.name}</strong>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                          {m.discount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Generic Substitute: <span className="font-semibold text-blue-600 dark:text-blue-400">{m.substitute}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs text-slate-400 line-through">₹{m.brandPrice}</span>
                        <strong className="text-base text-slate-900 dark:text-white font-extrabold">₹{m.price}</strong>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(m.name)}
                        className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1 font-bold rounded-lg"
                      >
                        + Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500">🚚 Free express delivery on orders over ₹299</span>
                <Button variant="secondary" onClick={() => setMedicineModalOpen(false)}>
                  Close Store
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* 🦾 MODAL 2: MEDICAL EQUIPMENT SERVICES MODAL (BUY / RENT / SELL / EXCHANGE) */}
        {equipmentModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Medical Equipment Services Hub
                  </h3>
                  <p className="text-xs text-slate-500">
                    Certified medical equipment available for Buy, Rent, Sell, or Exchange.
                  </p>
                </div>
                <button onClick={() => setEquipmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action Selector Tabs */}
              <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-center text-xs font-bold">
                {['Buy', 'Rent', 'Sell', 'Exchange'].map((act) => (
                  <button
                    key={act}
                    onClick={() => setSelectedEquipmentAction(act)}
                    className={`py-2 rounded-lg transition-all ${
                      selectedEquipmentAction === act
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                    }`}
                  >
                    {act} Equipment
                  </button>
                ))}
              </div>

              {/* BUY / RENT CATALOG */}
              {(selectedEquipmentAction === 'Buy' || selectedEquipmentAction === 'Rent') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipmentItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">{item.name}</h4>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{item.rating} Verified Quality</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-xs">
                        <div>
                          {selectedEquipmentAction === 'Buy' ? (
                            <div>
                              <span className="text-[10px] text-slate-400 block">Buy Price</span>
                              <strong className="text-sm text-slate-900 dark:text-white">₹{item.buyPrice}</strong>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[10px] text-slate-400 block">Rent Rate</span>
                              <strong className="text-sm text-blue-600 dark:text-blue-400">₹{item.rentPrice}/day</strong>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddToCart(`${selectedEquipmentAction} - ${item.name}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5"
                        >
                          {selectedEquipmentAction} Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SELL / EXCHANGE FORM SIMULATION */}
              {(selectedEquipmentAction === 'Sell' || selectedEquipmentAction === 'Exchange') && (
                <div className="space-y-4 bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Submit Equipment for {selectedEquipmentAction} Inspection
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Equipment Name / Model</label>
                      <input type="text" placeholder="e.g. Oxygen Concentrator 5L" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Equipment Age / Condition</label>
                      <input type="text" placeholder="e.g. 6 Months old, Excellent" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setOrderSuccessMsg(`Your ${selectedEquipmentAction} request has been submitted! Inspection team will call you.`);
                      setEquipmentModalOpen(false);
                      setTimeout(() => setOrderSuccessMsg(''), 4000);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Submit {selectedEquipmentAction} Request
                  </Button>
                </div>
              )}

              <div className="text-right">
                <Button variant="secondary" onClick={() => setEquipmentModalOpen(false)}>
                  Close Hub
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* 🧪 MODAL 3: DIAGNOSTIC LAB TEST AT HOME MODAL */}
        {labTestModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    🧪 Diagnostic Lab Packages (Home Collection)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Certified NABL lab testing with home sample collection.
                  </p>
                </div>
                <button onClick={() => setLabTestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {labPackages.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900 dark:text-white">{pkg.title}</strong>
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-full">
                          {pkg.discount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{pkg.tests}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                        <strong className="text-base text-purple-600 font-extrabold">₹{pkg.price}</strong>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleAddToCart(pkg.title);
                          setLabTestModalOpen(false);
                        }}
                        className="mt-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 font-bold rounded-lg"
                      >
                        Book Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right">
                <Button variant="secondary" onClick={() => setLabTestModalOpen(false)}>
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* VIDEO TREATMENT DEMONSTRATION MODAL */}
        {videoModalOpen && (
          <TreatmentVideoModal
            isOpen={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            initialVideoId={selectedVidId}
          />
        )}

      </div>
    );
};
