import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('verto_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface Customer {
  id: string;
  _id?: string;
  companyName: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  _id?: string;
  companyName: string;
  email: string;
  apiKey?: string;
  documentTypesConfig: string[];
  isActive: boolean;
  createdAt: string;
}

export interface DocumentType {
  _id: string;
  name: string;
  description: string;
  requiredFor?: string[];
}

export interface PartnerCredentials {
  apiKey: string;
}

export interface ConsentRequest {
  _id: string;
  partner: {
    _id: string;
    companyName: string;
    email: string;
  };
  documentTypesRequested: string[];
  isGranted: boolean;
  grantedAt?: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      type: 'customer' | 'partner' | 'admin';
      email?: string;
      username?: string;
      companyName?: string;
      role?: string;
      apiKey?: string;
    };
  };
}

export interface User {
  id: string;
  type: 'customer' | 'partner' | 'admin';
  email?: string;
  username?: string;
  companyName?: string;
  role?: string;
  apiKey?: string;
}

// Auth Service
class AuthService {
  async loginCustomer(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/customer/login', {
      email,
      password,
    });
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
      this.setUser(response.data.data.user);
    }
    
    return response.data;
  }

  async loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/admin/login', {
      username,
      password,
    });
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
      this.setUser(response.data.data.user);
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors
    }
    this.clearAuth();
  }

  setToken(token: string): void {
    localStorage.setItem('verto_auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('verto_auth_token');
  }

  setUser(user: User): void {
    localStorage.setItem('verto_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('verto_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  clearAuth(): void {
    localStorage.removeItem('verto_auth_token');
    localStorage.removeItem('verto_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

// Customer Service
export const customerService = {
  register: async (data: { companyName: string; email: string; address: string; password: string }) => {
    const response = await api.post<ApiResponse<{ customer: Customer }>>('/register/customer', data);
    return response.data;
  },
  
  getMyDocuments: async () => {
    const response = await api.get<ApiResponse<{ documents: any[] }>>('/customers/me/documents');
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getDocumentTypes: async () => {
    const response = await api.get<ApiResponse<{ documentTypes: DocumentType[] }>>('/admin/document-types');
    return response.data;
  },
  
  createDocumentType: async (data: { name: string; description: string; requiredFor?: string[] }) => {
    const response = await api.post<ApiResponse<{ documentType: DocumentType }>>('/admin/document-types', data);
    return response.data;
  },
  
  getAllCustomers: async () => {
    const response = await api.get<ApiResponse<{ customers: Customer[] }>>('/admin/customers');
    return response.data;
  },
  
  getAllPartners: async () => {
    const response = await api.get<ApiResponse<{ partners: Partner[] }>>('/admin/partners');
    return response.data;
  },
  
  getUnverifiedDocuments: async () => {
    const response = await api.get<ApiResponse<{ documents: any[] }>>('/admin/documents/unverified');
    return response.data;
  },
  
  verifyDocument: async (documentId: string, adminId: string) => {
    const response = await api.put(`/admin/documents/${documentId}/verify`, { adminId });
    return response.data;
  },
};

// Upload Service
export const uploadService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<{
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
    }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

// Consent Service
export const consentService = {
  getMyConsents: async () => {
    const response = await api.get<ApiResponse<{ consents: ConsentRequest[] }>>('/customers/me/consents');
    return response.data;
  },
  
  viewConsentByToken: async (token: string) => {
    const response = await api.get<ApiResponse<{ consent: any }>>(`/customer/consent/${token}`);
    return response.data;
  },
  
  grantConsent: async (token: string) => {
    const response = await api.post<ApiResponse<any>>(`/customer/consent/${token}/grant`);
    return response.data;
  },
  
  revokeConsent: async (consentId: string) => {
    const response = await api.post<ApiResponse<any>>(`/customers/me/consents/${consentId}/revoke`);
    return response.data;
  },
};
