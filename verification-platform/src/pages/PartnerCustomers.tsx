import { useState, useEffect } from 'react';
import { fakeCustomers, fakeConsentRequests, type FakeCustomer } from '../services/fakeData.service';

const PartnerCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<FakeCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Filter customers who have granted consent to Vice International
      const consentedCustomerEmails = fakeConsentRequests
        .filter(consent => consent.isGranted && consent.partner.companyName === 'Vice International')
        .map(consent => consent.customerEmail || 'customer@gmail.com'); // Fallback for demo
      
      const consentedCustomers = fakeCustomers.filter(customer => 
        consentedCustomerEmails.includes(customer.email)
      );
      
      setCustomers(consentedCustomers);
      setLoading(false);
    }, 1000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="customers-table-container">
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
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading customer data...</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#48bb78';
      case 'pending': return '#ed8936';
      case 'inactive': return '#f56565';
      default: return '#a0aec0';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="partner-customers">
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Manage your registered customers and their document submissions</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({customers.length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active ({customers.filter(c => c.status === 'active').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({customers.filter(c => c.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive ({customers.filter(c => c.status === 'inactive').length})
          </button>
        </div>
      </div>

      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="company-cell">
                    <div className="company-name">{customer.companyName}</div>
                    <div className="company-email">{customer.email}</div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="contact-name">{customer.contactName}</div>
                    <div className="contact-phone">{customer.contactPhone}</div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadge(customer.status)}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="documents-cell">
                    <div className="documents-progress">
                      <span className="documents-count">
                        {customer.documentsSubmitted}/{customer.totalDocumentsRequired}
                      </span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(customer.documentsSubmitted / customer.totalDocumentsRequired) * 100}%`,
                            backgroundColor: getStatusColor(customer.status)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view-btn">View</button>
                    <button className="action-btn edit-btn">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3>No customers found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerCustomers;