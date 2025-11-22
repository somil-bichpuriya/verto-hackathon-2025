import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  LogOut,
  Shield,
  AlertCircle,
  Home,
} from 'lucide-react';
import {
  customerService,
  adminService,
  uploadService,
  consentService,
  authService,
  ConsentRequest,
} from '../services/api.service';

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

function CustomerDashboard() {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [consents, setConsents] = useState<ConsentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const user = authService.getUser();

  useEffect(() => {
    if (!authService.isAuthenticated() || user?.type !== 'customer') {
      navigate('/customer/login');
      return;
    }
    fetchData();
  }, [navigate, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, typesRes, consentsRes] = await Promise.all([
        customerService.getMyDocuments(),
        adminService.getDocumentTypes(),
        consentService.getMyConsents(),
      ]);

      setDocuments(docsRes.data?.documents || []);
      setDocumentTypes(typesRes.data?.documentTypes || []);
      setConsents(consentsRes.data?.consents || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/customer/login');
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
      setSuccess('');

      // Upload file
      const uploadResponse = await uploadService.uploadFile(selectedFile);
      const fileUrl = uploadResponse?.data?.url;

      // Create document record
      await fetch('http://localhost:3000/api/v1/customer/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          documentType: selectedDocType,
          s3Link: fileUrl,
        }),
      });

      setSuccess('Document uploaded successfully!');
      setShowUploadModal(false);
      setSelectedDocType('');
      setSelectedFile(null);

      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleRevokeConsent = async (consentId: string, partnerName: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${partnerName}?`)) {
      return;
    }

    try {
      setError('');
      await consentService.revokeConsent(consentId);
      setSuccess('Consent revoked successfully!');
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to revoke consent');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const grantedConsents = consents.filter((c) => c.isGranted);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user?.companyName || user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Verified</p>
            <p className="text-2xl font-bold text-gray-900">
              {documents.filter((d) => d.isVerified).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Pending Verification</p>
            <p className="text-2xl font-bold text-gray-900">
              {documents.filter((d) => !d.isVerified).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Partners with Access</p>
            <p className="text-2xl font-bold text-gray-900">{grantedConsents.length}</p>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                My Documents
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload and manage your verification documents
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              <Upload className="w-5 h-5" />
              Upload Document
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{doc.documentType}</h3>
                    </div>
                    {doc.isVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status: </span>
                      <span className={doc.isVerified ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Uploaded: </span>
                      <span className="text-gray-900">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {doc.isVerified && doc.verifiedAt && (
                      <div>
                        <span className="text-gray-600">Verified: </span>
                        <span className="text-gray-900">
                          {new Date(doc.verifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <a
                    href={doc.s3Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    View Document →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consents Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Document Access Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage partners who have access to your documents
            </p>
          </div>

          {consents.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No consent requests</h3>
              <p className="text-gray-600">No partners have requested access to your documents yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consents.map((consent) => (
                <div
                  key={consent._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{consent.partner.companyName}</h3>
                        {consent.isGranted ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Access Granted
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{consent.partner.email}</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Requested Documents: </span>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {consent.documentTypesRequested.map((docType, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                              >
                                {docType}
                              </span>
                            ))}
                          </div>
                        </div>
                        {consent.isGranted && consent.grantedAt && (
                          <div>
                            <span className="text-gray-600">Granted on: </span>
                            <span className="text-gray-900">
                              {new Date(consent.grantedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Expires: </span>
                          <span className="text-gray-900">
                            {new Date(consent.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {consent.isGranted && (
                      <button
                        onClick={() => handleRevokeConsent(consent._id, consent.partner.companyName)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  required
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose File *</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
