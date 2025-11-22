import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeDocumentTypes } from '../services/fakeData.service';
import './RegisterPartner.css';

const PartnerDocumentConfig = () => {
  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleDocTypeToggle = (typeName: string) => {
    setSelectedDocs((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
    setError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocs.length === 0) {
      setError('Please select at least one document type');
      return;
    }
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-header">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1>Document Configuration Saved!</h1>
            <p>Your document requirements have been saved.</p>
          </div>
          <button onClick={() => navigate('/partner/dashboard')} className="done-button">
            Go to Partner Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Configure Document Requirements</h1>
          <p>Select the document types your organization requires for onboarding.</p>
        </div>
        {error && (
          <div className="error-message">
            <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="register-form">
          <div className="form-group">
            <label>Document Types *</label>
            <div className="document-types-list">
              {fakeDocumentTypes.map((type) => (
                <label key={type.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(type.name)}
                    onChange={() => handleDocTypeToggle(type.name)}
                  />
                  <div className="checkbox-content">
                    <span className="type-name">{type.name}</span>
                    <span className="type-description">{type.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="submit-button">
            Save Document Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerDocumentConfig;