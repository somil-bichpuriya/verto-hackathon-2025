import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPartner = () => {
  const [email, setEmail] = useState('partner@viceinternational.com');
  const [password, setPassword] = useState('Vice@2024');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Static login validation for Vice International demo
    if (email === 'partner@viceinternational.com' && password === 'Vice@2024') {
      // Simulate successful login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/partner/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🤝</div>
          <h1>Partner Login</h1>
          <p className="subtitle">Sign in to access your partner dashboard</p>
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
          <h3>🔑 Vice International Demo Credentials</h3>
          <code>Email: partner@viceinternational.com</code>
          <code>Password: Vice@2024</code>
        </div>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <div className="login-links">
            <Link to="/partner/register" className="login-link">Register as Partner</Link>
            <Link to="/" className="login-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPartner;