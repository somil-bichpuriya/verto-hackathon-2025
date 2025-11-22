import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  AlertCircle,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { 
  getDocumentsByClientId, 
  getClientById, 
  updateDocumentStatus,
  initializeDocuments 
} from '../data/dataService';
import type { Document as DocType } from '../data/dataService';

function Documents() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [clientInfo, setClientInfo] = useState<any>(null);

  useEffect(() => {
    // Initialize documents from database
    initializeDocuments();
    
    // Load client info
    const cId = clientId || 'CLT-001';
    const client = getClientById(cId);
    if (client) {
      setClientInfo(client);
    } else {
      setClientInfo({
        id: cId,
        name: 'Acme Corporation Ltd',
        email: 'contact@acmecorp.com',
        country: 'United Kingdom',
      });
    }
    
    // Load documents for this client
    loadDocuments(cId);
  }, [clientId]);

  const loadDocuments = (cId: string) => {
    const docs = getDocumentsByClientId(cId);
    setDocuments(docs);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleReview = (doc: DocType, action: 'approve' | 'reject') => {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
      alert('Please log in to review documents');
      return;
    }
    
    const currentUser = JSON.parse(currentUserStr);
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    // Update document status in localStorage
    const updatedDoc = updateDocumentStatus(
      doc.id,
      status,
      currentUser.fullName,
      reviewNotes || undefined
    );
    
    if (updatedDoc) {
      // Reload documents to show updated status
      loadDocuments(clientId || 'CLT-001');
      
      // Show success message
      const message = action === 'approve' 
        ? `Document "${doc.name}" has been approved!\n\nReviewed by: ${currentUser.fullName}\nReview Date: ${updatedDoc.reviewDate}\nExpiry Date: ${updatedDoc.expiryDate}${reviewNotes ? '\nNotes: ' + reviewNotes : ''}`
        : `Document "${doc.name}" has been rejected.\n\nReviewed by: ${currentUser.fullName}\nReview Date: ${updatedDoc.reviewDate}${reviewNotes ? '\nNotes: ' + reviewNotes : ''}`;
      
      alert(message);
    }
    
    setReviewModal(false);
    setSelectedDoc(null);
    setReviewNotes('');
  };

  const openReviewModal = (doc: DocType) => {
    setSelectedDoc(doc);
    setReviewNotes(doc.reviewNotes || '');
    setReviewModal(true);
  };

  if (!clientInfo) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Client Info Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{clientInfo.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-blue-100">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {clientInfo.id}
                </span>
                <span>•</span>
                <span>{clientInfo.country}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/clients')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {documents.filter(d => d.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {documents.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {documents.filter(d => d.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
          <p className="text-sm text-gray-600 mt-1">Review and approve client verification documents</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {doc.type} • {doc.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Uploaded: {doc.uploadDate}
                      </span>
                      {doc.reviewedBy && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Reviewed by: {doc.reviewedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openReviewModal(doc)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => alert(`Downloading: ${doc.name}\n\nFile: ${doc.type}\nSize: ${doc.size}`)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Review Document</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedDoc.name}</p>
              </div>
              <button 
                onClick={() => setReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Document Preview Area */}
              <div className="bg-gray-100 rounded-lg mb-6 overflow-hidden min-h-[500px]">
                <iframe
                  src={selectedDoc.previewUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}
                  className="w-full h-[500px] border-0"
                  title="Document Preview"
                />
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Document ID</p>
                  <p className="font-semibold text-gray-900">{selectedDoc.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Upload Date</p>
                  <p className="font-semibold text-gray-900">{selectedDoc.uploadDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">File Type</p>
                  <p className="font-semibold text-gray-900">{selectedDoc.type}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedDoc.status)}`}>
                    {selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                  </span>
                </div>
                {selectedDoc.reviewedBy && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Reviewed By</p>
                      <p className="font-semibold text-gray-900">{selectedDoc.reviewedBy}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Review Date</p>
                      <p className="font-semibold text-gray-900">{selectedDoc.reviewDate}</p>
                    </div>
                  </>
                )}
                {selectedDoc.expiryDate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                    <p className="font-semibold text-gray-900">{selectedDoc.expiryDate}</p>
                  </div>
                )}
              </div>

              {/* Review Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Add any comments or notes about this document..."
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setReviewModal(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedDoc, 'reject')}
                className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => handleReview(selectedDoc, 'approve')}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;
