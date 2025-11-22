import { useState } from 'react';
import { Search, Building2, Mail, Globe, CheckCircle, Clock } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  email: string;
  country: string;
  requestsCount: number;
  status: 'active' | 'pending';
  joinedDate: string;
  lastRequest: string;
}

function Partners() {
  const [searchTerm, setSearchTerm] = useState('');

  const partners: Partner[] = [
    {
      id: 'PTR-001',
      name: 'FinTech Solutions Ltd',
      email: 'partners@fintech.com',
      country: 'United Kingdom',
      requestsCount: 45,
      status: 'active',
      joinedDate: '2023-06-15',
      lastRequest: '2 hours ago',
    },
    {
      id: 'PTR-002',
      name: 'PayGlobal Inc',
      email: 'integration@payglobal.com',
      country: 'United States',
      requestsCount: 32,
      status: 'active',
      joinedDate: '2023-08-20',
      lastRequest: '1 day ago',
    },
    {
      id: 'PTR-003',
      name: 'EuroTransfer SA',
      email: 'api@eurotransfer.eu',
      country: 'France',
      requestsCount: 28,
      status: 'active',
      joinedDate: '2023-09-10',
      lastRequest: '5 hours ago',
    },
    {
      id: 'PTR-004',
      name: 'Asia Pacific Verify',
      email: 'contact@apverify.com',
      country: 'Singapore',
      requestsCount: 12,
      status: 'pending',
      joinedDate: '2024-01-05',
      lastRequest: '3 days ago',
    },
    {
      id: 'PTR-005',
      name: 'Nordic Payment Systems',
      email: 'tech@nordicpay.no',
      country: 'Norway',
      requestsCount: 38,
      status: 'active',
      joinedDate: '2023-07-22',
      lastRequest: '12 hours ago',
    },
  ];

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1">Manage partner organizations accessing verification data</p>
        </div>
        <button 
          onClick={() => alert('Add New Partner\n\nThis would open a form to onboard a new partner organization.')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <Building2 className="w-5 h-5" />
          Add Partner
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Partners</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{partners.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Active Partners</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {partners.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {partners.reduce((sum, p) => sum + p.requestsCount, 0)}
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                partner.status === 'active' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {partner.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{partner.id}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {partner.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />
                {partner.country}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Data Requests</span>
                <span className="font-semibold text-gray-900">{partner.requestsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Last Request</span>
                <span className="text-gray-900">{partner.lastRequest}</span>
              </div>
            </div>

            <button 
              onClick={() => alert(`Viewing details for ${partner.name}\n\nRequests: ${partner.requestsCount}\nStatus: ${partner.status}\nJoined: ${partner.joinedDate}`)}
              className="w-full mt-4 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all font-medium"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No partners found matching your search</p>
        </div>
      )}
    </div>
  );
}

export default Partners;
