import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const mockProfiles = {
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

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('auth_user');
        return saved ? JSON.parse(saved) : mockProfiles.patient;
    });
    const [role, setRole] = useState(() => {
        return user ? user.role : 'patient';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verify token on app load if available
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            authAPI.getMe()
                .then((res) => {
                    if (res?.data?.user) {
                        const fetchedUser = res.data.user;
                        setUser(fetchedUser);
                        setRole(fetchedUser.role);
                        localStorage.setItem('auth_user', JSON.stringify(fetchedUser));
                    }
                })
                .catch(() => {
                    // Retain current session or clear invalid token
                });
        }
    }, []);

    // Real API Login
    const loginReal = async (credential, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authAPI.login({ phone: credential, password });
            if (res?.success && res?.data) {
                const { user: loggedUser, tokens } = res.data;
                if (tokens?.accessToken) {
                    localStorage.setItem('access_token', tokens.accessToken);
                    localStorage.setItem('refresh_token', tokens.refreshToken || '');
                }
                setUser(loggedUser);
                setRole(loggedUser.role);
                localStorage.setItem('auth_user', JSON.stringify(loggedUser));
                setLoading(false);
                return { success: true, user: loggedUser };
            }
            throw new Error(res?.message || 'Login failed');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
            setLoading(false);
            return { success: false, message: err.message };
        }
    };

    // Simulated / fallback quick login for UI preview
    const login = (emailOrPhone, targetRole) => {
        const profile = mockProfiles[targetRole] || mockProfiles.patient;
        setUser(profile);
        setRole(profile.role);
        localStorage.setItem('auth_user', JSON.stringify(profile));
        return true;
    };

    // Real Registration
    const registerReal = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authAPI.register(formData);
            setLoading(false);
            return res;
        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout().catch(() => {});
        } finally {
            setUser(null);
            setRole(null);
            localStorage.removeItem('auth_user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    const switchRole = (newRole) => {
        const profile = mockProfiles[newRole];
        if (profile) {
            setUser(profile);
            setRole(newRole);
            localStorage.setItem('auth_user', JSON.stringify(profile));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            loading,
            error,
            login,
            loginReal,
            registerReal,
            logout,
            switchRole
        }}>
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
