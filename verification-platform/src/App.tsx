import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Partners from './pages/Partners';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerDashboard from './pages/CustomerDashboard';
import FakeConsentPage from './pages/consent/FakeConsentPage';
import FakeOnboardingPage from './pages/consent/FakeOnboardingPage';
import LoginPartner from './pages/LoginPartner';
import RegisterPartner from './pages/RegisterPartner';
import PartnerDocumentConfig from './pages/PartnerDocumentConfig';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminLogin from './pages/AdminLogin';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        setIsAuthenticated(true);
        setUserType(user.role === 'admin' ? 'admin' : 'customer');
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated || userType !== 'admin' ? (
              <AdminLogin />
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated || userType !== 'admin' ? (
              <Register />
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={<Dashboard />
          } 
        />
        <Route path="/clients" element={<Clients />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:clientId" element={<Documents />} />

        {/* Customer Routes */}
        <Route 
          path="/customer/login" 
          element={
            !isAuthenticated || userType !== 'customer' ? (
              <CustomerLogin />
            ) : (
              <Navigate to="/customer/dashboard" />
            )
          } 
        />
        <Route 
          path="/customer/register" 
          element={
            !isAuthenticated || userType !== 'customer' ? (
              <CustomerRegister />
            ) : (
              <Navigate to="/customer/dashboard" />
            )
          } 
        />
        <Route 
          path="/customer/dashboard" 
          element={<CustomerDashboard />
          } 
        />
        
        {/* Public Consent Route */}  
        <Route path="/consent/:token" element={<FakeConsentPage />} />
        <Route path="/fake-onboarding" element={<FakeOnboardingPage />} />
        
        {/* Partner Routes (Public - Static Data) */}
        <Route path="/partner/login" element={<LoginPartner />} />
        <Route path="/partner/register" element={<RegisterPartner />} />
        <Route path="/partner/configure-documents" element={<PartnerDocumentConfig />} />
        <Route path="/partner/dashboard/*" element={<PartnerDashboard />} />
        
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
