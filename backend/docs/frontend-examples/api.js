import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', withCredentials: true });
api.interceptors.request.use(config => { const token = localStorage.getItem('accessToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
let refreshing;
api.interceptors.response.use(r => r, async error => { const request = error.config; if (error.response?.status !== 401 || request._retried || request.url.includes('/auth/refresh-token')) return Promise.reject(error); request._retried = true; refreshing ||= api.post('/auth/refresh-token', { refreshToken: localStorage.getItem('refreshToken') }).then(({ data }) => { localStorage.setItem('accessToken', data.data.accessToken); localStorage.setItem('refreshToken', data.data.refreshToken); }).finally(() => { refreshing = undefined; }); await refreshing; return api(request); });
export default api;
