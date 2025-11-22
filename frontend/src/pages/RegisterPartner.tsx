import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerService, adminService } from '../services/api.service';
import type { DocumentType, PartnerCredentials } from '../types';
import './RegisterPartner.css';

const RegisterPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    documentTypesConfig: [] as string[],
    password: '',
    confirmPassword: '',
  });
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [credentials, setCredentials] = useState<PartnerCredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await adminService.getDocumentTypes();
      console.log('Document types response:', response);
      if (response.data?.documentTypes) {
        console.log('Setting document types:', response.data.documentTypes);
        setDocumentTypes(response.data.documentTypes);
      } else {
        console.error('No documentTypes in response:', response);
        setError('No document types available. Please contact admin to set up document types first.');
      }
    } catch (err: any) {
      console.error('Failed to fetch document types:', err);
      console.error('Error details:', err.response?.data);
      setError(`Failed to load document types: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleDocTypeToggle = (typeName: string) => {
    setFormData((prev) => ({
      ...prev,
      documentTypesConfig: prev.documentTypesConfig.includes(typeName)
        ? prev.documentTypesConfig.filter((t) => t !== typeName)
        : [...prev.documentTypesConfig, typeName],
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.documentTypesConfig.length === 0) {
      setError('Please select at least one document type');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await partnerService.register(registrationData);
      if (response.success && response.data?.credentials) {
        setCredentials(response.data.credentials);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleDone = () => {
    navigate('/pricing');
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
              <h3>How to use your credentials:</h3>
              <pre className="code-example">
{`curl -X GET \\
  http://localhost:3000/api/v1/partner/me \\
  -H "x-api-key: ${credentials.apiKey}" \\
  -H "x-api-secret: ${credentials.apiSecret}"`}
              </pre>
            </div>
          </div>

          <button onClick={handleDone} className="done-button">
            Done - Go to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Partner Registration</h1>
          <p>Register your organization to integrate with Verto</p>
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
            <label>Document Types You Need Access To *</label>
            {loadingTypes ? (
              <div className="loading-types">Loading document types...</div>
            ) : documentTypes.length === 0 ? (
              <div className="no-types">No document types available. Please contact admin.</div>
            ) : (
              <div className="document-types-list">
                {documentTypes.map((type) => (
                  <label key={type._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.documentTypesConfig.includes(type.name)}
                      onChange={() => handleDocTypeToggle(type.name)}
                      disabled={loading}
                    />
                    <div className="checkbox-content">
                      <span className="type-name">{type.name}</span>
                      <span className="type-description">{type.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
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
              placeholder="At least 6 characters"
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading || loadingTypes}>
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
            <a href="/login/partner" className="link">
              Login here
            </a>
          </p>
          <p>
            Are you a customer?{' '}
            <a href="/register/customer" className="link">
              Register as Customer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPartner;
