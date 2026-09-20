import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartprocure_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem('smartprocure_token');
        localStorage.removeItem('smartprocure_user');
      }
      const data = error.response.data;
      let userMessage = data?.message || data?.error || `Request failed with status ${status}`;
      if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
        const details = Object.entries(data.fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        userMessage += ` (${details})`;
      }
      error.userMessage = userMessage;
    } else if (error.request) {
      error.userMessage = 'Network error. Please verify backend server is running.';
    } else {
      error.userMessage = error.message;
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const verifyEmailToken = (token) => api.post('/auth/verify-email', { token });
export const forgotPasswordApi = (email) => api.post('/auth/forgot-password', { email });
export const resetPasswordApi = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
export const getDepartments = () => api.get('/departments');

// Purchase Requests
export const createPurchaseRequest = (data) => api.post('/requests', data);
export const getMyRequests = () => api.get('/requests/my');
export const getRequestById = (id) => api.get(`/requests/${id}`);
export const checkDuplicateRequest = (payload) => api.post('/requests/check-duplicate', payload);

// Approvals & SLA
export const getPendingApprovals = () => api.get('/approvals/pending');
export const submitApprovalDecision = (requestId, decision) =>
  api.post(`/approvals/requests/${requestId}/decision`, decision);
export const getApprovalHistory = (requestId) =>
  api.get(`/approvals/requests/${requestId}/history`);

// Command Center & Budget & Audit & Notifications & Search
export const getCommandCenterMetrics = () => api.get('/command-center/metrics');
export const getBudgetImpact = (deptId, cost) =>
  api.get(`/departments/${deptId}/budget-impact?cost=${cost}`);
export const getRequestTimeline = (requestId) => api.get(`/requests/${requestId}/timeline`);
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.post('/notifications/read-all');
export const globalSearch = (query) => api.get(`/search?q=${encodeURIComponent(query)}`);

export default api;
