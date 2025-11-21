import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: 'customer' | 'partner' | 'admin';
}

const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login page
  if (!user) {
    const loginPath = requiredType === 'admin' 
      ? '/login/admin' 
      : requiredType === 'partner' 
      ? '/login/partner' 
      : '/login/customer';
    return <Navigate to={loginPath} replace />;
  }

  // If user type doesn't match required type, redirect to appropriate page
  if (requiredType && user.type !== requiredType) {
    // If admin trying to access customer/partner routes, redirect to admin dashboard
    if (user.type === 'admin' && requiredType !== 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
