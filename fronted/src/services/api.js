import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Centralized Axios Instance Configuration
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request Interceptor: Automatically inject Authorization token if present
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Extract data or format backend errors consistently
 */
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || 'Network error, please check connection to server';
        const customError = new Error(message);
        customError.status = error.response?.status;
        customError.data = error.response?.data;
        return Promise.reject(customError);
    }
);

export default api;

// -------------------------------------------------------------
// Authentication APIs (Axios)
// -------------------------------------------------------------
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    sendOTP: (phoneData) => api.post('/auth/send-otp', phoneData),
    verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
    getMe: () => api.get('/auth/me'),
    updateMe: (data) => api.put('/auth/me', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    logout: () => api.post('/auth/logout'),
};

// -------------------------------------------------------------
// Patient APIs (Axios)
// -------------------------------------------------------------
export const patientAPI = {
    getMe: () => api.get('/patients/me'),
    updateMe: (data) => api.put('/patients/me', data),
    updateHealthInfo: (data) => api.put('/patients/me/health-info', data),
    addAllergy: (data) => api.post('/patients/me/allergies', data),
    addChronicDisease: (data) => api.post('/patients/me/chronic-diseases', data),
    addMedication: (data) => api.post('/patients/me/medications', data),
    updateEmergencyContact: (data) => api.put('/patients/me/emergency-contact', data),
    getSummary: () => api.get('/patients/me/summary'),
    getHighRisk: () => api.get('/patients/high-risk'),
    getStatistics: () => api.get('/patients/statistics'),
    getAll: (params = '') => api.get(`/patients${params ? `?${params}` : ''}`),
    getById: (id) => api.get(`/patients/${id}`),
};

// -------------------------------------------------------------
// Doctor APIs (Axios)
// -------------------------------------------------------------
export const doctorAPI = {
    getAll: (params = '') => api.get(`/doctors${params ? `?${params}` : ''}`),
    search: (query) => api.get(`/doctors/search?q=${encodeURIComponent(query)}`),
    getBySpecialization: (spec) => api.get(`/doctors/specialization/${encodeURIComponent(spec)}`),
    getById: (id) => api.get(`/doctors/${id}`),
    getAvailability: (id) => api.get(`/doctors/${id}/availability`),
    getStatistics: () => api.get('/doctors/statistics'),
    updateQueueStatus: (id, status) => api.put(`/doctors/${id}/queue-status`, { isAvailable: status }),
    create: (data) => api.post('/doctors', data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`),
};

// -------------------------------------------------------------
// Facility APIs (Axios)
// -------------------------------------------------------------
export const facilityAPI = {
    getAll: (params = '') => api.get(`/facilities${params ? `?${params}` : ''}`),
    search: (query) => api.get(`/facilities/search?q=${encodeURIComponent(query)}`),
    getNearby: (lat = 19.0760, lng = 72.8777, dist = 50) => api.get(`/facilities/nearby?lat=${lat}&lng=${lng}&distance=${dist}`),
    getByType: (type) => api.get(`/facilities/type/${encodeURIComponent(type)}`),
    getById: (id) => api.get(`/facilities/${id}`),
    getDoctors: (id) => api.get(`/facilities/${id}/doctors`),
    getServices: (id) => api.get(`/facilities/${id}/services`),
    getStatistics: () => api.get('/facilities/statistics'),
    create: (data) => api.post('/facilities', data),
    update: (id, data) => api.put(`/facilities/${id}`, data),
    delete: (id) => api.delete(`/facilities/${id}`),
};

// -------------------------------------------------------------
// Appointment APIs (Axios)
// -------------------------------------------------------------
export const appointmentAPI = {
    create: (data) => api.post('/appointments', data),
    getMy: () => api.get('/appointments/my'),
    getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
    cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { cancellationReason: reason }),
};

// -------------------------------------------------------------
// Queue Management APIs (Axios)
// -------------------------------------------------------------
export const queueAPI = {
    checkIn: (appointmentId) => api.post(`/queue/check-in/${appointmentId}`),
    getStatus: (appointmentId) => api.get(`/queue/status/${appointmentId}`),
    callNext: () => api.post('/queue/next'),
    complete: (appointmentId) => api.post(`/queue/complete/${appointmentId}`),
};

// -------------------------------------------------------------
// Clinical Records & Prescriptions APIs (Axios)
// -------------------------------------------------------------
export const medicalRecordAPI = {
    create: (data) => api.post('/medical-records', data),
    getByPatient: (patientId) => api.get(`/medical-records/patient/${patientId}`),
    getById: (id) => api.get(`/medical-records/${id}`),
    update: (id, data) => api.put(`/medical-records/${id}`, data),
};

export const prescriptionAPI = {
    create: (data) => api.post('/prescriptions', data),
    getMy: () => api.get('/prescriptions/my'),
    getById: (id) => api.get(`/prescriptions/${id}`),
};

export const labReportAPI = {
    create: (data) => api.post('/lab-reports', data),
    getMy: () => api.get('/lab-reports/my'),
    getByPatient: (patientId) => api.get(`/lab-reports/patient/${patientId}`),
};

// -------------------------------------------------------------
// Symptom Triage AI API (Axios)
// -------------------------------------------------------------
export const symptomAPI = {
    assess: (data) => api.post('/symptoms/assess', data),
};

// -------------------------------------------------------------
// Workflow (Referrals, Notifications, Teleconsultation, Follow-ups) APIs (Axios)
// -------------------------------------------------------------
export const referralAPI = {
    create: (data) => api.post('/referrals', data),
    getMy: () => api.get('/referrals/my'),
    getByFacility: (facilityId) => api.get(`/referrals/facility/${facilityId}`),
    accept: (id) => api.put(`/referrals/${id}/accept`),
    scheduleAppointment: (id, appointmentId) => api.put(`/referrals/${id}/appointment`, { appointment: appointmentId }),
    complete: (id) => api.put(`/referrals/${id}/complete`),
};

export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
};

export const teleconsultationAPI = {
    create: (data) => api.post('/teleconsultation/create', data),
    start: (id) => api.post(`/teleconsultation/${id}/start`),
    end: (id) => api.post(`/teleconsultation/${id}/end`),
    getMy: () => api.get('/teleconsultation/my'),
};

export const followUpAPI = {
    create: (data) => api.post('/follow-ups', data),
    getMy: () => api.get('/follow-ups/my'),
    complete: (id) => api.put(`/follow-ups/${id}/complete`),
};
