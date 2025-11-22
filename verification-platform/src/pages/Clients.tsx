import { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  email: string;
  country: string;
  status: 'approved' | 'pending' | 'rejected';
  documents: number;
  joinedDate: string;
  lastActivity: string;
}

function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const clients: Client[] = [
    {
      id: 'CLT-001',
      name: 'Acme Corporation Ltd',
      email: 'contact@acmecorp.com',
      country: 'United Kingdom',
      status: 'approved',
      documents: 8,
      joinedDate: '2024-01-15',
      lastActivity: '2 hours ago',
    },
    {
      id: 'CLT-002',
      name: 'TechStart Inc',
      email: 'info@techstart.com',
      country: 'United States',
      status: 'pending',
      documents: 5,
      joinedDate: '2024-02-20',
      lastActivity: '1 day ago',
    },
    {
      id: 'CLT-003',
      name: 'Global Traders SA',
      email: 'admin@globaltraders.es',
      country: 'Spain',
      status: 'rejected',
      documents: 4,
      joinedDate: '2024-01-10',
      lastActivity: '3 days ago',
    },
    {
      id: 'CLT-004',
      name: 'Eastern Imports Pte Ltd',
      email: 'support@easternimports.sg',
      country: 'Singapore',
      status: 'approved',
      documents: 12,
      joinedDate: '2023-12-05',
      lastActivity: '5 hours ago',
    },
    {
      id: 'CLT-005',
      name: 'Nordic Solutions AS',
      email: 'contact@nordicsolutions.no',
      country: 'Norway',
      status: 'pending',
      documents: 6,
      joinedDate: '2024-03-01',
      lastActivity: '12 hours ago',
    },
    {
      id: 'CLT-006',
      name: 'Pacific Trade Group',
      email: 'info@pacifictrade.au',
      country: 'Australia',
      status: 'approved',
      documents: 9,
      joinedDate: '2023-11-20',
      lastActivity: '1 hour ago',
    },
    {
      id: 'CLT-007',
      name: 'Alpine Industries GmbH',
      email: 'kontakt@alpine-ind.de',
      country: 'Germany',
      status: 'pending',
      documents: 7,
      joinedDate: '2024-02-14',
      lastActivity: '8 hours ago',
    },
    {
      id: 'CLT-008',
      name: 'Maple Exports Ltd',
      email: 'hello@mapleexports.ca',
      country: 'Canada',
      status: 'approved',
      documents: 10,
      joinedDate: '2023-10-30',
      lastActivity: '3 hours ago',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage and review client information</p>
        </div>
        <button 
          onClick={() => alert('Exporting client data...\n\nThis would generate a CSV/Excel file with all client information.')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              onClick={() => alert('Advanced Filters\n\nFilter by:\n• Date Range\n• Country\n• Document Count\n• Compliance Status')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Approved Clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {clients.filter(c => c.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {clients.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {clients.filter(c => c.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{client.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{client.country}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(client.status)}`}>
                      {getStatusIcon(client.status)}
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{client.documents} files</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{client.lastActivity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/documents/${client.id}`)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;
