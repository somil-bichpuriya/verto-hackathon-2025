import React, { useState } from 'react';
import './ConsentPage.css';

const fakeConsent = {
  partnerName: 'Acme Financial Ltd.',
  customerEmail: 'jane.doe@globex.com',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  documentTypesNeeded: ['d1', 'd2'],
};

const fakeDocTypes = [
  { _id: 'd1', name: 'Certificate of Incorporation', description: 'Company registration document.' },
  { _id: 'd2', name: 'Bank Statement', description: 'Latest bank statement.' },
  { _id: 'd3', name: 'Proof of Address', description: 'Utility bill or rental agreement.' },
];

export const FakeConsentPage: React.FC = () => {
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>(fakeConsent.documentTypesNeeded);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [granted, setGranted] = useState(false);
  const [denied, setDenied] = useState(false);

  const handleToggleDocType = (docTypeId: string) => {
    setSelectedDocTypes(prev =>
      prev.includes(docTypeId)
        ? prev.filter(id => id !== docTypeId)
        : [...prev, docTypeId]
    );
  };

  const handleGrant = () => {
    if (selectedDocTypes.length === 0) {
      setError('Please select at least one document type to share');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setGranted(true);
      setProcessing(false);
    }, 1200);
  };

  const handleDeny = () => {
    setProcessing(true);
    setTimeout(() => {
      setDenied(true);
      setProcessing(false);
    }, 1200);
  };

  const getDocTypeName = (docTypeId: string) => {
    const docType = fakeDocTypes.find(dt => dt._id === docTypeId);
    return docType ? docType.name : docTypeId;
  };

  if (granted) {
    return (
      <div className="consent-page">
        <div style={{position: 'absolute', top: 24, left: 32}}>
          <span style={{fontWeight: 900, fontSize: '2.5rem', color: 'white', letterSpacing: '2px'}}>Verto</span>
        </div>
        <div className="consent-container">
          <div className="consent-header">
            <div className="consent-icon">✅</div>
            <h1>Consent Granted</h1>
            <p className="consent-subtitle">You have successfully shared your documents with {fakeConsent.partnerName}.</p>
          </div>
        </div>
      </div>
    );
  }
  if (denied) {
    return (
      <div className="consent-page">
        <div style={{position: 'absolute', top: 24, left: 32}}>
          <span style={{fontWeight: 900, fontSize: '2.5rem', color: 'white', letterSpacing: '2px'}}>Verto</span>
        </div>
        <div className="consent-container">
          <div className="consent-header">
            <div className="consent-icon">❌</div>
            <h1>Consent Denied</h1>
            <p className="consent-subtitle">You have declined the document access request from {fakeConsent.partnerName}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consent-page">
      <div style={{position: 'absolute', top: 24, left: 32}}>
        <span style={{fontWeight: 900, fontSize: '2.5rem', color: 'white', letterSpacing: '2px'}}>Verto</span>
      </div>
      <div className="consent-container">
        <div className="consent-header">
            <div style={{display: 'flex',  alignItems: 'center'}}>
          <div className="consent-icon">🔐</div>
          <h1>Document Sharing Request</h1>
            </div>
          <p className="consent-subtitle">
            <strong>{fakeConsent.partnerName}</strong> is requesting access to your documents for compliance review.
          </p>
        </div>
        {error && <div className="error-banner">{error}</div>}
        <div className="consent-details">
          <div className="detail-row">
            <span className="label">Requesting Organization:</span>
            <span className="value">{fakeConsent.partnerName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Your Account:</span>
            <span className="value">{fakeConsent.customerEmail}</span>
          </div>
          <div className="detail-row">
            <span className="label">Request Expires:</span>
            <span className="value">{new Date(fakeConsent.expiresAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="consent-permissions">
          <h2>Select Documents to Share</h2>
          <p className="permissions-subtitle">
            Please select which document types you wish to share with {fakeConsent.partnerName} for their due diligence process.
          </p>
          <div className="doc-types-list">
            {fakeConsent.documentTypesNeeded.map((docTypeId: string) => {
              const isSelected = selectedDocTypes.includes(docTypeId);
              const docType = fakeDocTypes.find(dt => dt._id === docTypeId);
              return (
                <div
                  key={docTypeId}
                  className={`doc-type-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleDocType(docTypeId)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleDocType(docTypeId)}
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="doc-type-info">
                    <h3>{getDocTypeName(docTypeId)}</h3>
                    {docType && <p>{docType.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="consent-actions">
          <button
            onClick={handleDeny}
            disabled={processing}
            className="deny-button"
          >
            {processing ? 'Processing...' : 'Decline Request'}
          </button>
          <button
            onClick={handleGrant}
            disabled={processing || selectedDocTypes.length === 0}
            className="grant-button"
          >
            {processing ? 'Processing...' : `Grant Access (${selectedDocTypes.length} documents)`}
          </button>
        </div>
        <div className="consent-info">
          <h3>What happens next?</h3>
          <ul>
            <li>{fakeConsent.partnerName} will be able to access only the documents you select</li>
            <li>You may revoke access at any time from your dashboard</li>
            <li>This consent is specific to this organization and request</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FakeConsentPage;
