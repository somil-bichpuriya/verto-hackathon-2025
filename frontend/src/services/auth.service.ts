import { api } from '../config/api';

const TOKEN_KEY = 'verto_auth_token';
const USER_KEY = 'verto_user';

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

class AuthService {
  /**
   * Customer login
   */
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

  /**
   * Partner login
   */
  async loginPartner(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/partner/login', {
      email,
      password,
    });
    
    if (response.data.data) {
      this.setToken(response.data.data.token);
      this.setUser(response.data.data.user);
    }
    
    return response.data;
  }

  /**
   * Admin login
   */
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

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors, clear local storage anyway
    }
    this.clearAuth();
  }

  /**
   * Store token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Store user in localStorage
   */
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Clear all auth data
   */
  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get auth header for API requests
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
