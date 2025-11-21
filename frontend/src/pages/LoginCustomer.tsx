import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const LoginCustomer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login('customer', { email, password });
      navigate('/customer/dashboard'); // Redirect to customer dashboard after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">👤</div>
          <h1>Customer Login</h1>
          <p className="subtitle">Sign in to access your Verto account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>🔑 Demo Credentials</h3>
          <code>Email: demo@customer.com</code>
          <code>Password: Demo@123</code>
        </div>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <div className="login-links">
            <Link to="/register/customer" className="login-link">Register as Customer</Link>
            <Link to="/login/partner" className="login-link">Partner Login</Link>
            <Link to="/login/admin" className="login-link">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCustomer;
