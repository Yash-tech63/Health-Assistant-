import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
// Public pages
import { Landing } from '../pages/public/Landing';
import { About } from '../pages/public/About';
import { Services } from '../pages/public/Services';
import { DoctorSearch } from '../pages/public/DoctorSearch';
import { HospitalSearch } from '../pages/public/HospitalSearch';
import { EmergencyDispatch } from '../pages/public/EmergencyDispatch';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
// Patient pages
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { DoctorDiscovery } from '../pages/patient/DoctorDiscovery';
import { MedicalRecords } from '../pages/patient/MedicalRecords';
import { Prescriptions } from '../pages/patient/Prescriptions';
import { Chat } from '../pages/patient/Chat';
import { HealthAssistChatbot } from '../pages/patient/HealthAssistChatbot';
import { PatientTeleconsult } from '../pages/patient/PatientTeleconsult';
import { Settings } from '../pages/patient/Settings';
// Doctor pages
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { PatientsList } from '../pages/doctor/PatientsList';
import { ReferralsList } from '../pages/doctor/ReferralsList';
import { Schedule } from '../pages/doctor/Schedule';
import { DoctorTeleconsult } from '../pages/doctor/DoctorTeleconsult';
// Hospital pages
import { HospitalDashboard } from '../pages/hospital/HospitalDashboard';
import { Inventory } from '../pages/hospital/Inventory';
import { H2HCommunication } from '../pages/hospital/H2HCommunication';
// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { AuditLogs } from '../pages/admin/AuditLogs';
export const AppRouter = () => {
    return (<Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/services" element={<Services />}/>
        <Route path="/doctors" element={<DoctorSearch />}/>
        <Route path="/hospitals" element={<HospitalSearch />}/>
        <Route path="/emergency" element={<EmergencyDispatch />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Route>

      {/* Portal layouts - Role-based Dashboards */}
      <Route element={<DashboardLayout />}>
        {/* Patient Portal */}
        <Route path="/portal/patient" element={<PatientDashboard />}/>
        <Route path="/portal/patient/book" element={<DoctorDiscovery />}/>
        <Route path="/portal/patient/teleconsult" element={<PatientTeleconsult />}/>
        <Route path="/portal/patient/records" element={<MedicalRecords />}/>
        <Route path="/portal/patient/prescriptions" element={<Prescriptions />}/>
        <Route path="/portal/patient/chat" element={<Chat />}/>
        <Route path="/portal/patient/bot" element={<HealthAssistChatbot />}/>
        <Route path="/portal/patient/emergency" element={<EmergencyDispatch />}/>
        <Route path="/portal/patient/settings" element={<Settings />}/>

        {/* Doctor Portal */}
        <Route path="/portal/doctor" element={<DoctorDashboard />}/>
        <Route path="/portal/doctor/patients" element={<PatientsList />}/>
        <Route path="/portal/doctor/referrals" element={<ReferralsList />}/>
        <Route path="/portal/doctor/teleconsult" element={<DoctorTeleconsult />}/>
        <Route path="/portal/doctor/schedule" element={<Schedule />}/>

        {/* Hospital Portal */}
        <Route path="/portal/hospital" element={<HospitalDashboard />}/>
        <Route path="/portal/hospital/inventory" element={<Inventory />}/>
        <Route path="/portal/hospital/h2h" element={<H2HCommunication />}/>

        {/* Admin Portal */}
        <Route path="/portal/admin" element={<AdminDashboard />}/>
        <Route path="/portal/admin/users" element={<UserManagement />}/>
        <Route path="/portal/admin/audit" element={<AuditLogs />}/>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
};
