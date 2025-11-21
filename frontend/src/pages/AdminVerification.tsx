import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/api.service';
import './AdminCustomers.css';

interface UnverifiedDocument {
  _id: string;
  customer: { companyName: string; email: string };
  documentType: { name: string };
  s3Link: string;
  isVerified: boolean;
  createdAt: string;
}

const AdminVerification = () => {
  const [documents, setDocuments] = useState<UnverifiedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login/admin');
  };

  useEffect(() => {
    fetchUnverifiedDocuments();
  }, []);

  const fetchUnverifiedDocuments = async () => {
    try {
      const response = await adminService.getUnverifiedDocuments();
      if (response.data?.documents) {
        setDocuments(response.data.documents);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentId: string) => {
    setVerifying(documentId);
    try {
      // Generate a valid MongoDB ObjectId for demo purposes
      const demoAdminId = '507f1f77bcf86cd799439011';
      await adminService.verifyDocument(documentId, demoAdminId);
      // Refresh the list
      await fetchUnverifiedDocuments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify document');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">Loading verification queue...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <Link to="/admin" className="back-link">← Back to Dashboard</Link>
          <h1>Document Verification Queue</h1>
          <p>Review and verify uploaded documents</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="content-card">
        <div className="table-header">
          <h2>Pending Verification ({documents.length})</h2>
        </div>
        
        {documents.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>All documents verified! 🎉</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Document Type</th>
                  <th>S3 Link</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div className="font-semibold">{doc.customer.companyName}</div>
                      <div className="text-sm text-gray">{doc.customer.email}</div>
                    </td>
                    <td>
                      <span className="badge">{doc.documentType.name}</span>
                    </td>
                    <td>
                      <a href={doc.s3Link} target="_blank" rel="noopener noreferrer" className="link">
                        View Document
                      </a>
                    </td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleVerify(doc._id)}
                        disabled={verifying === doc._id}
                        className="verify-button"
                      >
                        {verifying === doc._id ? 'Verifying...' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification;
