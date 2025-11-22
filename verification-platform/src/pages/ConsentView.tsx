import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Clock, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import { consentService } from '../services/api.service';

function ConsentView() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [consent, setConsent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [granting, setGranting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid consent link');
      setLoading(false);
      return;
    }
    fetchConsentDetails();
  }, [token]);

  const fetchConsentDetails = async () => {
    try {
      setLoading(true);
      const response = await consentService.viewConsentByToken(token!);
      setConsent(response.data?.consent);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consent details');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantConsent = async () => {
    try {
      setGranting(true);
      setError('');
      await consentService.grantConsent(token!);
      setSuccess(true);
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to grant consent');
    } finally {
      setGranting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consent request...</p>
        </div>
      </div>
    );
  }

  if (error && !consent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/customer/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Consent Granted!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully granted access to {consent?.partner?.companyName}.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-2xl relative">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Access Request</h1>
          <p className="text-gray-600">Review and grant access to your documents</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Partner Info */}
          <div className="mb-6 p-6 bg-blue-50 rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Partner Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Company Name:</span>
                <p className="font-semibold text-gray-900">{consent?.partner?.companyName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-semibold text-gray-900">{consent?.partner?.email}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Company Name:</span>
                <p className="font-semibold text-gray-900">{consent?.customer?.companyName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-semibold text-gray-900">{consent?.customer?.email}</p>
              </div>
            </div>
          </div>

          {/* Requested Documents */}
          <div className="mb-6 p-6 bg-green-50 rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Requested Documents
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {consent?.partner?.companyName} is requesting access to the following document types:
            </p>
            <div className="flex flex-wrap gap-2">
              {consent?.documentTypesRequested?.map((docType: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg border border-green-200"
                >
                  {docType}
                </span>
              ))}
            </div>
          </div>

          {/* Expiry Info */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Consent Validity</p>
              <p className="text-sm text-gray-600 mt-1">
                This consent will expire on{' '}
                <span className="font-semibold">
                  {new Date(consent?.expiresAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Status */}
          {consent?.isGranted ? (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">Access Already Granted</p>
                <p className="text-sm text-green-700 mt-1">
                  You granted access on {new Date(consent?.grantedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Important Notice */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notice</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>By granting consent, you allow the partner to access your specified documents</li>
                  <li>You can revoke this consent at any time from your dashboard</li>
                  <li>The partner will only have access until the expiry date</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  to="/customer/dashboard"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center font-medium"
                >
                  View Dashboard
                </Link>
                <button
                  onClick={handleGrantConsent}
                  disabled={granting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {granting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Granting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Grant Access
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure document sharing powered by V-Verify</p>
        </div>
      </div>
    </div>
  );
}

export default ConsentView;
