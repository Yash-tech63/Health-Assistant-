import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Facility, Doctor, Patient, Referral, Prescription, DiagnosticReport,
  MedicineInventoryItem, Appointment, ChatMessage, AuditLog,
  initialFacilities, initialDoctors, initialPatients, initialReferrals,
  initialPrescriptions, initialDiagnostics, initialInventory, initialAppointments,
  initialMessages, initialAuditLogs
} from '../data/mockData';

interface HealthStoreType {
  facilities: Facility[];
  doctors: Doctor[];
  patients: Patient[];
  referrals: Referral[];
  prescriptions: Prescription[];
  diagnostics: DiagnosticReport[];
  inventory: MedicineInventoryItem[];
  appointments: Appointment[];
  messages: ChatMessage[];
  auditLogs: AuditLog[];
  
  // Actions
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  createReferral: (referral: Omit<Referral, 'id' | 'status' | 'date'>) => void;
  updateReferralStatus: (id: string, status: Referral['status'], notes?: string) => void;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'date'>) => void;
  sendMessage: (senderId: string, senderName: string, receiverId: string, content: string) => void;
  updateInventoryStock: (id: string, change: number) => void;
  createPatient: (patient: Omit<Patient, 'id'>) => void;
  addAuditLog: (action: string, actorName: string, actorRole: string, details: string) => void;
}

const HealthStoreContext = createContext<HealthStoreType | undefined>(undefined);

export const HealthStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('hs_facilities');
    return saved ? JSON.parse(saved) : initialFacilities;
  });
  
  const [doctors] = useState<Doctor[]>(initialDoctors);
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hs_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('hs_referrals');
    return saved ? JSON.parse(saved) : initialReferrals;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('hs_prescriptions');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  const [diagnostics, setDiagnostics] = useState<DiagnosticReport[]>(() => {
    const saved = localStorage.getItem('hs_diagnostics');
    return saved ? JSON.parse(saved) : initialDiagnostics;
  });

  const [inventory, setInventory] = useState<MedicineInventoryItem[]>(() => {
    const saved = localStorage.getItem('hs_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hs_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hs_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hs_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hs_facilities', JSON.stringify(facilities));
  }, [facilities]);
  
  useEffect(() => {
    localStorage.setItem('hs_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hs_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('hs_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('hs_diagnostics', JSON.stringify(diagnostics));
  }, [diagnostics]);

  useEffect(() => {
    localStorage.setItem('hs_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('hs_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('hs_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('hs_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Methods
  const addAuditLog = (action: string, actorName: string, actorRole: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      action,
      actorName,
      actorRole,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const bookAppointment = (appt: Omit<Appointment, 'id' | 'status'>) => {
    const newAppt: Appointment = {
      ...appt,
      id: `A-${Date.now()}`,
      status: 'Scheduled'
    };
    setAppointments(prev => [newAppt, ...prev]);
    addAuditLog('Book Appointment', appt.patientName, 'patient', `Scheduled appointment with ${appt.doctorName} at ${appt.facilityName}`);
  };

  const createReferral = (ref: Omit<Referral, 'id' | 'status' | 'date'>) => {
    const newRef: Referral = {
      ...ref,
      id: `R-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setReferrals(prev => [newRef, ...prev]);
    
    const destFacility = facilities.find(f => f.id === ref.toFacilityId);
    // Add a corresponding pending diagnostic report at the destination
    const newDiag: DiagnosticReport = {
      id: `DR-${Date.now()}`,
      patientId: ref.patientId,
      testName: destFacility?.type === 'Specialist' ? 'Coronary Angiography' : 'Routine Diagnostic Screening',
      facilityName: ref.toFacilityName,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      isUrgent: true
    };
    setDiagnostics(prev => [newDiag, ...prev]);

    addAuditLog('Create Referral', ref.referredByDoctorName, 'doctor', `Referred ${ref.patientName} from ${ref.fromFacilityName} to ${ref.toFacilityName}`);
  };

  const updateReferralStatus = (id: string, status: Referral['status'], notes?: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id === id) {
        addAuditLog('Update Referral Status', 'Hospital admissions Desk', 'hospital', `Referral R-${id} marked as ${status}`);
        return { ...ref, status, notes: notes || ref.notes };
      }
      return ref;
    }));
  };

  const createPrescription = (presc: Omit<Prescription, 'id' | 'date'>) => {
    const newPresc: Prescription = {
      ...presc,
      id: `PR-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setPrescriptions(prev => [newPresc, ...prev]);
    addAuditLog('Write Prescription', presc.doctorName, 'doctor', `Prescribed medicines for patient ${presc.patientId}`);
  };

  const sendMessage = (senderId: string, senderName: string, receiverId: string, content: string) => {
    const newMsg: ChatMessage = {
      id: `M-${Date.now()}`,
      senderId,
      senderName,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const updateInventoryStock = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + change);
        if (newStock < item.minStockThreshold) {
          addAuditLog('Inventory Stock Alert', 'Pharmacy System', 'admin', `${item.name} stock low: ${newStock} units left`);
        }
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  const createPatient = (p: Omit<Patient, 'id'>) => {
    const newPat: Patient = {
      ...p,
      id: `P-${Date.now()}`
    };
    setPatients(prev => [...prev, newPat]);
    addAuditLog('Patient Registration', p.name, 'patient', `Registered ABHA Account: ${p.abhaId}`);
  };

  return (
    <HealthStoreContext.Provider value={{
      facilities, doctors, patients, referrals, prescriptions, diagnostics,
      inventory, appointments, messages, auditLogs,
      bookAppointment, createReferral, updateReferralStatus, createPrescription,
      sendMessage, updateInventoryStock, createPatient, addAuditLog
    }}>
      {children}
    </HealthStoreContext.Provider>
  );
};

export const useHealthStore = () => {
  const context = useContext(HealthStoreContext);
  if (!context) {
    throw new Error('useHealthStore must be used within a HealthStoreProvider');
  }
  return context;
};
