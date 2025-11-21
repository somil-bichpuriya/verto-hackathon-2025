import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { customerService, adminService, uploadService } from '../services/api.service';
import './CustomerDashboard.css';

interface CustomerDocument {
  id: string;
  documentType: string;
  s3Link: string;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  uploadedAt: string;
}

interface DocumentType {
  _id: string;
  name: string;
  description: string;
}

const CustomerDashboard = () => {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login/customer');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch documents and document types in parallel
      const [docsResponse, typesResponse] = await Promise.all([
        customerService.getMyDocuments(),
        adminService.getDocumentTypes(),
      ]);
      
      setDocuments(docsResponse.data?.documents || []);
      setDocumentTypes(typesResponse.data?.documentTypes || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocType || !selectedFile) {
      setError('Please select a document type and choose a file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadSuccess('');
      
      // First, upload the file to get the URL
      const uploadResponse = await uploadService.uploadFile(selectedFile);
      const fileUrl = uploadResponse?.data?.url;
      
      // Then, create the document record with the uploaded file URL
      await fetch('http://localhost:3000/api/v1/customer/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('verto_auth_token')}`,
        },
        body: JSON.stringify({
          documentType: selectedDocType,
          s3Link: fileUrl,
        }),
      });

      setUploadSuccess('Document uploaded successfully!');
      setShowUploadModal(false);
      setSelectedDocType('');
      setSelectedFile(null);
      
      // Refresh documents list
      await fetchData();
      
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="loading-state">Loading your documents...</div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <div>
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>My Dashboard</h1>
          <p>Welcome, {user?.email || 'Customer'}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {uploadSuccess && <div className="success-banner">{uploadSuccess}</div>}

      <div className="content-card">
        <div className="card-header">
          <h2>📄 My Documents ({documents.length})</h2>
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="upload-button"
          >
            + Upload Document
          </button>
        </div>
        <p className="card-description">View your uploaded documents and their verification status</p>
        
        {documents.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3>No Documents Yet</h3>
            <p>You haven't uploaded any documents. Start by uploading your first document.</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-header">
                  <div className="document-type">
                    <svg className="doc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>{doc.documentType}</h3>
                  </div>
                  <span className={`status-badge ${doc.isVerified ? 'verified' : 'pending'}`}>
                    {doc.isVerified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>
                
                <div className="document-info">
                  <div className="info-row">
                    <span className="label">Uploaded:</span>
                    <span className="value">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {doc.isVerified && doc.verifiedAt && (
                    <>
                      <div className="info-row">
                        <span className="label">Verified:</span>
                        <span className="value">{new Date(doc.verifiedAt).toLocaleDateString()}</span>
                      </div>
                      {doc.verifiedBy && (
                        <div className="info-row">
                          <span className="label">Verified By:</span>
                          <span className="value">{doc.verifiedBy}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <a 
                  href={doc.s3Link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-document-btn"
                >
                  View Document →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{documents.length}</div>
          <div className="stat-label">Total Documents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{documents.filter(d => d.isVerified).length}</div>
          <div className="stat-label">Verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{documents.filter(d => !d.isVerified).length}</div>
          <div className="stat-label">Pending Verification</div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Upload Document</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUploadDocument} className="upload-form">
              <div className="form-group">
                <label htmlFor="docType">Document Type *</label>
                <select
                  id="docType"
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  required
                  disabled={uploading}
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fileInput">Choose File *</label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  required
                  disabled={uploading}
                  className="file-input"
                />
                {selectedFile && (
                  <div className="file-preview">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
                <small className="form-hint">
                  Accepted formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB)
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="cancel-button"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
