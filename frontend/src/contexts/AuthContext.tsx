import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (type: 'customer' | 'partner' | 'admin', credentials: { email?: string; username?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();
      
      if (storedUser && token) {
        // Verify token is still valid by fetching current user
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          authService.clearAuth();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (
    type: 'customer' | 'partner' | 'admin',
    credentials: { email?: string; username?: string; password: string }
  ) => {
    try {
      let response;
      
      if (type === 'customer' && credentials.email) {
        response = await authService.loginCustomer(credentials.email, credentials.password);
      } else if (type === 'partner' && credentials.email) {
        response = await authService.loginPartner(credentials.email, credentials.password);
      } else if (type === 'admin' && credentials.username) {
        response = await authService.loginAdmin(credentials.username, credentials.password);
      } else {
        throw new Error('Invalid login credentials');
      }

      setUser(response.data.user);
    } catch (error) {
      authService.clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
