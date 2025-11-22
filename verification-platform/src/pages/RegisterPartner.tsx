import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPartner.css';

function randomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < len; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

const RegisterPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: 'Vice International',
    email: 'partner@viceinternational.com',
    password: 'Vice@2024',
    contactName: 'John Smith',
    contactPhone: '+1-555-0123'
  });
  const [credentials, setCredentials] = useState<{ apiKey: string; apiSecret: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.password || !formData.contactName || !formData.contactPhone) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setCredentials({
        apiKey: 'pk_' + randomString(16),
        apiSecret: 'sk_' + randomString(32),
      });
      setLoading(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (credentials) {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-header">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1>Partner Registration Successful!</h1>
            <p>Save your API credentials - they won't be shown again</p>
          </div>
          <div className="credentials-section">
            <div className="warning-banner">
              <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <strong>Important:</strong> Store these credentials securely. You won't be able to retrieve them later.
            </div>
            <div className="credential-item">
              <label>API Key</label>
              <div className="credential-display">
                <code>{credentials.apiKey}</code>
                <button
                  onClick={() => copyToClipboard(credentials.apiKey, 'API Key')}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="credential-item">
              <label>API Secret</label>
              <div className="credential-display">
                <code>{credentials.apiSecret}</code>
                <button
                  onClick={() => copyToClipboard(credentials.apiSecret, 'API Secret')}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="usage-info">
              <h3>Demo Credentials Generated</h3>
              <p>These are demo API credentials for testing the Vice International partner platform. In a real implementation, these would be used to authenticate API requests.</p>
              <div className="demo-note">
                <strong>Note:</strong> This is a static demo - no actual API calls are made.
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/partner/configure-documents')} className="done-button">
            Configure Document Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Vice International Partner Registration</h1>
          <p>Complete your organization setup to access the Vice International partner platform</p>
        </div>
        {error && (
          <div className="error-message">
            <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter your company name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="partner@company.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactName">Contact Name *</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              placeholder="Contact person's name"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone *</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="Contact phone number"
              disabled={loading}
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              'Register Partner'
            )}
          </button>
        </form>
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a href="/partner/login" className="link">
              Login here
            </a>
          </p>
          <p>
            Are you a customer?{' '}
            <a href="/customer/register" className="link">
              Register as Customer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPartner;