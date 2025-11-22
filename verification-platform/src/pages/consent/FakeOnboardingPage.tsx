import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConsentPage.css';

export const FakeOnboardingPage: React.FC = () => {
  const [dbin, setDbin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbin.trim()) {
      setError('Please enter your Digital Business Identity Number.');
      return;
    }
    setError('');
    // Simulate consent link generation and redirect
    setTimeout(() => {
      navigate('/consent/a10740be-529d-4c98-b5d3-7bab4018e8c3');
    }, 800);
  };

  return (
    <div className="consent-page">
      <div className="consent-container">
        <div className="consent-header">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className="consent-icon">🏢</div>
            <h1>Vice International Ltd. Onboarding</h1>
          </div>
          <p className="consent-subtitle">
            Please enter your <strong>Digital Business Identity Number</strong> (DBIN) to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="dbin" style={{ fontWeight: 600, color: '#667eea', display: 'block', marginBottom: 8 }}>
              Digital Business Identity Number
            </label>
            <input
              id="dbin"
              type="text"
              value={dbin}
              onChange={e => setDbin(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 8,
                border: '2px solid #e5e7eb',
                fontSize: '1.1rem',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 4
              }}
              placeholder="e.g. BIP-100020"
            />
            {error && <div className="error-banner" style={{ marginTop: 8 }}>{error}</div>}
          </div>
          <button
            type="submit"
            className="grant-button"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700 }}
          >
            Continue to Consent
          </button>
        </form>
        <div className="consent-info" style={{ marginTop: '2rem' }}>
          <h3>Why do we need your BIP?</h3>
          <ul>
            <li>Allows Acme Financial Ltd. to securely request document access from Verto</li>
            <li>Ensures compliance and secure onboarding</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FakeOnboardingPage;
