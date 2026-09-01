import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  abhaId?: string; // For patients
  specialty?: string; // For doctors
  facilityName?: string; // For doctors, hospitals, admins
  facilityType?: 'PHC' | 'CHC' | 'District' | 'Specialist'; // Facility levels
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const mockProfiles: Record<UserRole, UserProfile> = {
  patient: {
    id: 'P-101',
    name: 'Rajesh Kumar',
    email: 'patient@swasthya.in',
    role: 'patient',
    abhaId: '91-8273-9281-2831',
    facilityName: 'Dhami Rural Primary Health Centre',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  },
  doctor: {
    id: 'D-205',
    name: 'Dr. Arvind Sharma',
    email: 'doctor@swasthya.in',
    role: 'doctor',
    specialty: 'General Medicine / Cardiologist',
    facilityName: 'Shimla District Hospital',
    facilityType: 'District',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop'
  },
  hospital: {
    id: 'H-302',
    name: 'District Hospital Shimla (Admissions Desk)',
    email: 'hospital@swasthya.in',
    role: 'hospital',
    facilityName: 'Shimla District Hospital',
    facilityType: 'District',
    avatar: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=400&auto=format&fit=crop'
  },
  admin: {
    id: 'A-401',
    name: 'Anjali Desai (Director of Health Services)',
    email: 'admin@swasthya.in',
    role: 'admin',
    facilityName: 'Central Health Ministry (NDHM)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    return user ? user.role : null;
  });

  const login = (email: string, targetRole: UserRole): boolean => {
    // Simulated login check
    const profile = mockProfiles[targetRole];
    if (profile) {
      setUser(profile);
      setRole(targetRole);
      localStorage.setItem('auth_user', JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('auth_user');
  };

  const switchRole = (newRole: UserRole) => {
    const profile = mockProfiles[newRole];
    if (profile) {
      setUser(profile);
      setRole(newRole);
      localStorage.setItem('auth_user', JSON.stringify(profile));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
