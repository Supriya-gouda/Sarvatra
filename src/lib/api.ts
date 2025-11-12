// API Configuration and Utilities
const API_BASE_URL = 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestOptions = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    // Add JWT token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  // POST with FormData (for file uploads)
  async postFormData(endpoint: string, formData: FormData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  // PATCH request
  async patch(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const api = new ApiClient();

// API methods
export const reportApi = {
  // Submit new report
  submitReport: async (formData: FormData) => {
    return api.postFormData('/api/reports', formData);
  },

  // Get all reports
  getReports: async (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/reports?${params}`);
  },

  // Get specific report
  getReport: async (reportId: string) => {
    return api.get(`/api/reports/${reportId}`);
  },

  // Approve/dismiss report
  updateReport: async (reportId: string, action: string, trustScore?: number) => {
    return api.patch(`/api/reports/${reportId}`, { action, trustScore });
  },
};

export const alertApi = {
  // Get active alerts
  getActiveAlerts: async () => {
    return api.get('/api/cap-alerts/active');
  },

  // Create new alert
  createAlert: async (alertData: any) => {
    return api.post('/api/cap-alerts', alertData);
  },

  // Update alert
  updateAlert: async (alertId: string, updateData: any) => {
    return api.patch(`/api/cap-alerts/${alertId}`, updateData);
  },
};

export const dashboardApi = {
  // Get dashboard data
  getDashboardData: async () => {
    return api.get('/api/dashboard/data');
  },
};

export const riskApi = {
  // Get risk index
  getRiskIndex: async () => {
    return api.get('/api/risk-index');
  },
};

export const routeApi = {
  // Get safe/blocked routes
  getRoutes: async (origin: string, destination: string, disasterType: string) => {
    const params = new URLSearchParams({ origin, destination, disasterType }).toString();
    return api.get(`/api/routes?${params}`);
  },
};

export const feedbackApi = {
  // Submit alert response
  submitResponse: async (responseData: any) => {
    return api.post('/api/alert-response', responseData);
  },

  // Get response statistics
  getResponseStats: async (alertId: string) => {
    return api.get(`/api/alert-response/status?alertId=${alertId}`);
  },
};

export const chatbotApi = {
  // Query chatbot
  query: async (queryData: any) => {
    return api.post('/api/chatbot', queryData);
  },
};

export const weatherApi = {
  // Get current weather
  getCurrent: async (lat?: number, lon?: number) => {
    const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    return api.get(`/api/weather/current${params}`);
  },

  // Get forecast
  getForecast: async (lat?: number, lon?: number) => {
    const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    return api.get(`/api/weather/forecast${params}`);
  },

  // Get weather layers
  getLayers: async () => {
    return api.get('/api/weather/layers');
  },

  // Get weather alerts
  getAlerts: async (lat?: number, lon?: number) => {
    const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    return api.get(`/api/weather/alerts${params}`);
  },
};

export const authApi = {
  // Login with role
  login: async (email: string, password: string, role: 'citizen' | 'authority' = 'citizen', accessCode?: string) => {
    const response = await api.post('/api/auth/login', { email, password, role, accessCode });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', response.user.role);
    }
    return response;
  },

  // Register
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', response.user.role);
    }
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole') || null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Check if user is authority
  isAuthority: () => {
    return localStorage.getItem('userRole') === 'authority';
  },

  // Verify token
  verifyToken: async () => {
    return api.get('/api/auth/verify');
  },
};

export default api;
