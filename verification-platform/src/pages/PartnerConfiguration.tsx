import { useState, useEffect } from 'react';
import { fakeDocumentTypes, type FakeDocumentType } from '../services/fakeData.service';

const PartnerConfiguration = () => {
  const [loading, setLoading] = useState(true);
  const [documentTypes, setDocumentTypes] = useState<FakeDocumentType[]>([]);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setDocumentTypes(fakeDocumentTypes);
      setLoading(false);
    }, 1000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="partner-configuration">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading configuration...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="partner-configuration">
      <div className="page-header">
        <h1>Configuration</h1>
        <p>Manage your partner settings and document requirements</p>
      </div>

      <div className="config-sections">
        <div className="config-card">
          <div className="card-header">
            <h2>📋 Document Requirements</h2>
            <p>Documents you require from customers during registration</p>
          </div>

          <div className="document-types-list">
            {documentTypes.map((docType) => (
              <div key={docType.id} className="document-type-item">
                <div className="document-type-header">
                  <div className="document-type-info">
                    <h3>{docType.name}</h3>
                    <p>{docType.description}</p>
                  </div>
                  <div className="document-type-status">
                    <span className={`status-badge ${docType.required ? 'required' : 'optional'}`}>
                      {docType.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                </div>
                <div className="document-type-actions">
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn delete-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-document-section">
            <button className="add-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Document Type
            </button>
          </div>
        </div>

        <div className="config-card">
          <div className="card-header">
            <h2>🔧 Partner Settings</h2>
            <p>Configure your partner account preferences</p>
          </div>

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications when customers register or submit documents</p>
              </div>
              <div className="setting-toggle">
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Auto-approve Documents</h3>
                <p>Automatically approve documents that pass validation</p>
              </div>
              <div className="setting-toggle">
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Customer Portal Access</h3>
                <p>Allow customers to access their dashboard after registration</p>
              </div>
              <div className="setting-toggle">
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="config-card">
          <div className="card-header">
            <h2>🔑 API Configuration</h2>
            <p>Your API credentials for integration</p>
          </div>

          <div className="api-credentials">
            <div className="credential-item">
              <label>API Key</label>
              <div className="credential-display">
                <code>pk_live_****************************</code>
                <button className="copy-btn" title="Copy to clipboard">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="credential-item">
              <label>API Secret</label>
              <div className="credential-display">
                <code>sk_live_****************************</code>
                <button className="copy-btn" title="Copy to clipboard">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="api-info">
              <p><strong>Demo Webhook URL:</strong> https://api.viceinternational.com/webhooks/partners/demo-partner-id</p>
              <p><strong>Demo Documentation:</strong> <a href="#" className="link">View Vice International API Docs</a></p>
              <div className="demo-note">
                <strong>Note:</strong> This is a static demo - no actual webhooks or API calls are configured.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerConfiguration;