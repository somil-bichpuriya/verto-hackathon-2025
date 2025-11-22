import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  LogOut,
  Shield,
  AlertCircle,
  Home,
} from 'lucide-react';
import {
  fakeCustomerDocuments,
  fakeCustomerDocumentTypes,
  fakeConsentRequests,
  type FakeCustomerDocument,
  type FakeDocumentType,
  type FakeConsentRequest
} from '../services/fakeData.service';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<FakeCustomerDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<FakeDocumentType[]>([]);
  const [consents, setConsents] = useState<FakeConsentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use static data instead of API calls
      setDocuments(fakeCustomerDocuments);
      setDocumentTypes(fakeCustomerDocumentTypes);
      setConsents(fakeConsentRequests);
    } catch (err: any) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Static logout - just navigate
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

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to static documents list
      const newDoc: FakeCustomerDocument = {
        id: Date.now().toString(),
        documentType: documentTypes.find(dt => dt.id === selectedDocType)?.name || 'Unknown',
        s3Link: '#',
        isVerified: false,
        verifiedBy: null,
        verifiedAt: null,
        uploadedAt: new Date().toISOString(),
      };

      setDocuments(prev => [...prev, newDoc]);
      setSuccess('Document uploaded successfully!');
      setSelectedDocType('');
      setSelectedFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    try {
      setError('');
      setSuccess('');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update static data
      setConsents(prev => prev.map(consent =>
        consent._id === consentId
          ? { ...consent, isGranted: false }
          : consent
      ));

      setSuccess('Consent revoked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to revoke consent');
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
  const completedDocuments = documents.filter((d) => d.isVerified);
  const pendingDocuments = documents.filter((d) => !d.isVerified);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Customer Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{completedDocuments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingDocuments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Consents</p>
                <p className="text-2xl font-semibold text-gray-900">{grantedConsents.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Upload Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Upload Document</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                  <label htmlFor="docType" className="block text-sm font-medium text-gray-700">
                    Document Type
                  </label>
                  <select
                    id="docType"
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a document type</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    File
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                        <p className="text-sm text-gray-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {doc.isVerified && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {!doc.isVerified && <Clock className="h-5 w-5 text-yellow-500" />}
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        doc.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consent Requests */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Consent Requests</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {consents.map((consent) => (
              <div key={consent._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consent.partner.companyName}</p>
                      <p className="text-sm text-gray-500">
                        Document types: {consent.documentTypesRequested.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {consent.isGranted && (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Granted
                        </span>
                        <button
                          onClick={() => handleRevokeConsent(consent._id)}
                          className="text-xs px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                    {!consent.isGranted && (
                      <>
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {consents.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No consent requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
