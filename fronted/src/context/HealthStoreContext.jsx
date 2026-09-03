import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFacilities, initialDoctors, initialPatients, initialReferrals, initialPrescriptions, initialDiagnostics, initialInventory, initialAppointments, initialMessages, initialAuditLogs } from '../data/mockData';
import { facilityAPI, doctorAPI, patientAPI, referralAPI, prescriptionAPI, appointmentAPI } from '../services/api';

const HealthStoreContext = createContext(undefined);

export const HealthStoreProvider = ({ children }) => {
    const [facilities, setFacilities] = useState(() => {
        const saved = localStorage.getItem('hs_facilities');
        return saved ? JSON.parse(saved) : initialFacilities;
    });
    const [doctors, setDoctors] = useState(() => {
        const saved = localStorage.getItem('hs_doctors');
        return saved ? JSON.parse(saved) : initialDoctors;
    });
    const [patients, setPatients] = useState(() => {
        const saved = localStorage.getItem('hs_patients');
        return saved ? JSON.parse(saved) : initialPatients;
    });
    const [referrals, setReferrals] = useState(() => {
        const saved = localStorage.getItem('hs_referrals');
        return saved ? JSON.parse(saved) : initialReferrals;
    });
    const [prescriptions, setPrescriptions] = useState(() => {
        const saved = localStorage.getItem('hs_prescriptions');
        return saved ? JSON.parse(saved) : initialPrescriptions;
    });
    const [diagnostics, setDiagnostics] = useState(() => {
        const saved = localStorage.getItem('hs_diagnostics');
        return saved ? JSON.parse(saved) : initialDiagnostics;
    });
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('hs_inventory');
        return saved ? JSON.parse(saved) : initialInventory;
    });
    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem('hs_appointments');
        return saved ? JSON.parse(saved) : initialAppointments;
    });
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('hs_messages');
        return saved ? JSON.parse(saved) : initialMessages;
    });
    const [auditLogs, setAuditLogs] = useState(() => {
        const saved = localStorage.getItem('hs_audit_logs');
        return saved ? JSON.parse(saved) : initialAuditLogs;
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch initial data from backend APIs
    useEffect(() => {
        const fetchBackendData = async () => {
            setIsLoading(true);
            try {
                const [facRes, docRes] = await Promise.allSettled([
                    facilityAPI.getAll(),
                    doctorAPI.getAll()
                ]);

                if (facRes.status === 'fulfilled' && facRes.value?.data?.facilities?.length) {
                    const fetchedFacs = facRes.value.data.facilities.map(f => ({
                        id: f._id || f.id,
                        name: f.name,
                        type: f.facilityType || 'PHC',
                        location: f.address ? `${f.address.street || ''}, ${f.address.city || ''}` : f.location,
                        bedsAvailable: f.availableBeds ?? f.bedsAvailable ?? 10,
                        totalBeds: f.totalBeds ?? 20,
                        image: f.image || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop'
                    }));
                    setFacilities(fetchedFacs);
                }

                if (docRes.status === 'fulfilled' && docRes.value?.data?.doctors?.length) {
                    const fetchedDocs = docRes.value.data.doctors.map(d => ({
                        id: d._id || d.id,
                        name: d.name || (d.user ? d.user.name : 'Dr. Doctor'),
                        specialty: d.specialization || d.specialty || 'General Medicine',
                        facilityId: d.facility?._id || d.facilityId,
                        facilityName: d.facility?.name || d.facilityName || 'District Hospital',
                        availability: d.availabilityHours || ['Mon 9:00 AM - 1:00 PM'],
                        rating: d.rating || 4.8,
                        avatar: d.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'
                    }));
                    setDoctors(fetchedDocs);
                }
            } catch (err) {
                console.warn('Backend store load warning:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBackendData();
    }, []);

    // Sync state changes to localStorage
    useEffect(() => {
        localStorage.setItem('hs_facilities', JSON.stringify(facilities));
    }, [facilities]);
    useEffect(() => {
        localStorage.setItem('hs_doctors', JSON.stringify(doctors));
    }, [doctors]);
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

    const addAuditLog = (action, actorName, actorRole, details) => {
        const newLog = {
            id: `LOG-${Date.now()}`,
            action,
            actorName,
            actorRole,
            details,
            timestamp: new Date().toISOString()
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const bookAppointment = async (appt) => {
        const newAppt = {
            ...appt,
            id: `A-${Date.now()}`,
            status: 'Scheduled'
        };

        try {
            await appointmentAPI.create({
                doctor: appt.doctorId,
                facility: appt.facilityId,
                appointmentDate: appt.date || new Date(),
                appointmentTime: appt.timeSlot || '10:00 AM',
                reasonForVisit: appt.type || 'Consultation'
            }).catch(() => {});
        } catch (e) {
            console.warn('API Appointment sync note:', e);
        }

        setAppointments(prev => [newAppt, ...prev]);
        addAuditLog('Book Appointment', appt.patientName, 'patient', `Scheduled appointment with ${appt.doctorName} at ${appt.facilityName}`);
    };

    const createReferral = async (ref) => {
        const newRef = {
            ...ref,
            id: `R-${Date.now()}`,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };

        try {
            await referralAPI.create({
                patient: ref.patientId,
                targetFacility: ref.toFacilityId,
                reason: ref.reason,
                notes: ref.notes
            }).catch(() => {});
        } catch (e) {
            console.warn('API Referral sync note:', e);
        }

        setReferrals(prev => [newRef, ...prev]);
        const destFacility = facilities.find(f => f.id === ref.toFacilityId);
        const newDiag = {
            id: `DR-${Date.now()}`,
            patientId: ref.patientId,
            testName: destFacility?.type === 'Specialist' ? 'Coronary Angiography' : 'Routine Diagnostic Screening',
            facilityName: ref.toFacilityName,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            isUrgent: true
        };
        setDiagnostics(prev => [newDiag, ...prev]);
        addAuditLog('Create Referral', ref.referredByDoctorName || 'Doctor', 'doctor', `Referred ${ref.patientName} to ${ref.toFacilityName}`);
    };

    const updateReferralStatus = async (id, status, notes) => {
        try {
            if (status === 'Accepted' || status === 'accepted') {
                await referralAPI.accept(id).catch(() => {});
            }
        } catch (e) {
            console.warn('API Referral update note:', e);
        }

        setReferrals(prev => prev.map(ref => {
            if (ref.id === id) {
                addAuditLog('Update Referral Status', 'Hospital Desk', 'hospital', `Referral R-${id} marked as ${status}`);
                return { ...ref, status, notes: notes || ref.notes };
            }
            return ref;
        }));
    };

    const createPrescription = async (presc) => {
        const newPresc = {
            ...presc,
            id: `PR-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            await prescriptionAPI.create({
                patient: presc.patientId,
                medications: presc.medicines || [],
                notes: presc.notes
            }).catch(() => {});
        } catch (e) {
            console.warn('API Prescription sync note:', e);
        }

        setPrescriptions(prev => [newPresc, ...prev]);
        addAuditLog('Write Prescription', presc.doctorName || 'Doctor', 'doctor', `Prescribed medicines for patient ${presc.patientId}`);
    };

    const sendMessage = (senderId, senderName, receiverId, content) => {
        const newMsg = {
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

    const updateInventoryStock = (id, change) => {
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

    const createPatient = (p) => {
        const newPat = {
            ...p,
            id: `P-${Date.now()}`
        };
        setPatients(prev => [...prev, newPat]);
        addAuditLog('Patient Registration', p.name, 'patient', `Registered ABHA Account: ${p.abhaId}`);
    };

    return (
        <HealthStoreContext.Provider value={{
            facilities, doctors, patients, referrals, prescriptions, diagnostics,
            inventory, appointments, messages, auditLogs, isLoading,
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
