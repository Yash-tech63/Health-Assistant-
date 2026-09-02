import React, { createContext, useContext, useState } from 'react';
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'nav.services': 'Services',
        'nav.doctors': 'Find Doctors',
        'nav.hospitals': 'Find Hospitals',
        'nav.emergency': 'Emergency ',
        'nav.login': 'Sign In',
        'nav.register': 'Register',
        'nav.dashboard': 'Dashboard',
        'nav.logout': 'Sign Out',
        // Landing Page
        'landing.title': 'Abhimanyu Health',
        'landing.subtitle': 'Empowering Indian Healthcare from Root to Specialist',
        'landing.description': 'A unified digital platform connecting Primary Health Centres (PHCs), District Hospitals, and Specialists. Track referrals, access digital prescriptions, check local medicine stock, and download diagnostics.',
        'landing.cta.start': 'Register for ABHA',
        'landing.cta.login': 'Access Swasthya Portal',
        'landing.stats.patients': '1.2 Cr+ Registered Patients',
        'landing.stats.hospitals': '15,000+ Tier 1-3 Facilities',
        'landing.stats.consultations': '50 Lakh+ Consultations',
        // Shared Portal UI
        'portal.abha': 'ABHA Health Card',
        'portal.notifications': 'Notifications',
        'portal.settings': 'Settings',
        'portal.language': 'Language',
        'portal.theme': 'Theme',
        // Journey Tracker
        'journey.phc': 'Local Health Centre (PHC)',
        'journey.district': 'District Hospital (CHC)',
        'journey.specialist': 'Super-Specialist Hospital',
        'journey.diagnostics': 'Diagnosis & Lab Reports',
        'journey.prescription': 'Prescription issued',
        'journey.medicine': 'Medicine Picked Up',
        'journey.followup': 'Follow-Up Scheduled'
    },
    hi: {
        // Navigation
        'nav.home': 'मुख्य पृष्ठ',
        'nav.about': 'हमारे बारे में',
        'nav.services': 'सेवाएं',
        'nav.doctors': 'डॉक्टर ढूंढें',
        'nav.hospitals': 'अस्पताल ढूंढें',
        'nav.emergency': 'आपत्कालीन 🚨',
        'nav.login': 'लॉग इन करें',
        'nav.register': 'पंजीकरण',
        'nav.dashboard': 'डैशबोर्ड',
        'nav.logout': 'लॉग आउट',
        // Landing Page
        'landing.title': 'Abhimanyu Health',
        'landing.subtitle': 'भारतीय स्वास्थ्य सेवा को जमीनी स्तर से विशेषज्ञ तक सशक्त बनाना',
        'landing.description': 'प्राथमिक स्वास्थ्य केंद्रों (PHC), जिला अस्पतालों और विशेषज्ञों को जोड़ने वाला एक एकीकृत डिजिटल मंच। रेफरल ट्रैक करें, डिजिटल नुस्खे देखें, स्थानीय दवा स्टॉक की जांच करें और प्रयोगशाला रिपोर्ट डाउनलोड करें।',
        'landing.cta.start': 'आभा (ABHA) पंजीकरण करें',
        'landing.cta.login': 'स्वास्थ्य पोर्टल खोलें',
        'landing.stats.patients': '1.2 करोड़+ पंजीकृत मरीज',
        'landing.stats.hospitals': '15,000+ टियर 1-3 केंद्र',
        'landing.stats.consultations': '50 लाख+ परामर्श',
        // Shared Portal UI
        'portal.abha': 'आभा (ABHA) हेल्थ कार्ड',
        'portal.notifications': 'सूचनाएं',
        'portal.settings': 'सेटिंग्स',
        'portal.language': 'भाषा',
        'portal.theme': 'थीम',
        // Journey Tracker
        'journey.phc': 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
        'journey.district': 'जिला अस्पताल (CHC)',
        'journey.specialist': 'सुपर-स्पेशलिस्ट अस्पताल',
        'journey.diagnostics': 'निदान और लैब रिपोर्ट',
        'journey.prescription': 'दवा की पर्ची जारी',
        'journey.medicine': 'दवा प्राप्त की',
        'journey.followup': 'फॉलो-अप निर्धारित'
    }
};
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'hi' || saved === 'en') ? saved : 'en';
    });
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };
    const t = (key) => {
        return translations[language][key] || translations['en'][key] || key;
    };
    return (<LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>);
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
