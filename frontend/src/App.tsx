import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterPartner from './pages/RegisterPartner';
import CustomerSuccess from './pages/CustomerSuccess';
import LoginCustomer from './pages/LoginCustomer';
import LoginPartner from './pages/LoginPartner';
import LoginAdmin from './pages/LoginAdmin';
import CustomerDashboard from './pages/CustomerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminPartners from './pages/AdminPartners';
import AdminVerification from './pages/AdminVerification';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register/customer" element={<RegisterCustomer />} />
          <Route path="/register/customer/success" element={<CustomerSuccess />} />
          <Route path="/register/partner" element={<RegisterPartner />} />
          <Route path="/login/customer" element={<LoginCustomer />} />
          <Route path="/login/partner" element={<LoginPartner />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/customer/dashboard" element={
            <ProtectedRoute requiredType="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partner/dashboard" element={
            <ProtectedRoute requiredType="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute requiredType="admin">
              <AdminCustomers />
            </ProtectedRoute>
          } />
          <Route path="/admin/partners" element={
            <ProtectedRoute requiredType="admin">
              <AdminPartners />
            </ProtectedRoute>
          } />
          <Route path="/admin/verification" element={
            <ProtectedRoute requiredType="admin">
              <AdminVerification />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
