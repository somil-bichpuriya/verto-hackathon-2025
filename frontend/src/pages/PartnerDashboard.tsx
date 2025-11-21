import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { partnerService, adminService } from '../services/api.service';
import './PartnerDashboard.css';

interface DocumentType {
  _id: string;
  name: string;
  description: string;
}

interface Customer {
  id: string;
  companyName: string;
  email: string;
  address: string;
  createdAt: string;
}

const PartnerDashboard = () => {
  const [availableDocTypes, setAvailableDocTypes] = useState<DocumentType[]>([]);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login/partner');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch available document types
      const docTypesResponse = await adminService.getDocumentTypes();
      setAvailableDocTypes(docTypesResponse.data?.documentTypes || []);
      
      // Fetch partner's current document types configuration
      const configResponse = await partnerService.getMyDocumentTypes();
      setSelectedDocTypes(configResponse.data?.documentTypesConfig || []);
      
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDocType = (docTypeId: string) => {
    setSelectedDocTypes(prev => {
      if (prev.includes(docTypeId)) {
        return prev.filter(id => id !== docTypeId);
      } else {
        return [...prev, docTypeId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await partnerService.updateMyDocumentTypes(selectedDocTypes);
      
      setSuccess('Document requirements updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update document requirements');
      console.error('Error updating document types:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="partner-dashboard">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="partner-dashboard">
      <div className="dashboard-header">
        <div>
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Partner Dashboard</h1>
          <p>Welcome, {user?.email || 'Partner'}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="content-card">
        <div className="card-header">
          <h2>📋 Document Requirements</h2>
          <p>Select the document types you will request from your customers</p>
        </div>
        
        {availableDocTypes.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3>No Document Types Available</h3>
            <p>There are no document types configured in the system yet.</p>
          </div>
        ) : (
          <>
            <div className="doc-types-grid">
              {availableDocTypes.map((docType) => {
                const isSelected = selectedDocTypes.includes(docType._id);
                return (
                  <div 
                    key={docType._id} 
                    className={`doc-type-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleDocType(docType._id)}
                  >
                    <div className="doc-type-header">
                      <div className="checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleToggleDocType(docType._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <h3>{docType.name}</h3>
                    </div>
                    <p className="doc-type-description">{docType.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="actions-bar">
              <div className="selection-info">
                <span className="selection-count">{selectedDocTypes.length}</span>
                <span className="selection-text">document type(s) selected</span>
              </div>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="save-button"
              >
                {saving ? 'Saving...' : 'Save Requirements'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>ℹ️ About Document Requirements</h3>
          <p>
            Select the document types that you will request from your customers during their onboarding process. 
            Customers will be required to upload these documents when registering through your partner link.
          </p>
          <ul>
            <li>✓ Choose relevant document types for your business needs</li>
            <li>✓ Update requirements anytime</li>
            <li>✓ Customers will see selected requirements during registration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
