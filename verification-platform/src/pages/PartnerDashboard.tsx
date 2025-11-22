import { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { fakeDashboardMetrics, fakeChartData, type FakeDashboardMetrics } from '../services/fakeData.service';
import './PartnerDashboard.css';
import PartnerCustomers from './PartnerCustomers';
import PartnerConfiguration from './PartnerConfiguration';

const PartnerDashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<FakeDashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setMetrics(fakeDashboardMetrics);
      setChartData(fakeChartData);
      setLoading(false);
    }, 1000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-overview">
        <div className="loading-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '1rem'
        }}>
          <div className="loading-spinner" style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading dashboard data...</p>
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

  if (!metrics || !chartData) {
    return (
      <div className="dashboard-overview">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <p style={{ color: '#64748b' }}>Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{metrics.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>{metrics.activeCustomers}</h3>
            <p>Active Customers</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{metrics.pendingCustomers}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <h3>{metrics.documentsUploaded}/{metrics.totalDocuments}</h3>
            <p>Documents Uploaded</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Customer Growth</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {chartData.customerGrowth.map((data: any, index: number) => (
                <div key={data.month} className="bar-container">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.customers / 12) * 100}%`,
                      backgroundColor: `hsl(${200 + index * 20}, 70%, 50%)`
                    }}
                  />
                  <span className="bar-label">{data.month}</span>
                  <span className="bar-value">{data.customers}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Document Status</h3>
          <div className="chart-placeholder">
            <div className="pie-chart">
              {chartData.documentStatus.map((status: any) => (
                <div key={status.status} className="pie-segment">
                  <div
                    className="segment-color"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="segment-label">{status.status}: {status.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🆕</div>
            <div className="activity-content">
              <p><strong>Global Tech Solutions Ltd</strong> completed registration</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📄</div>
            <div className="activity-content">
              <p><strong>Innovative Finance Corp</strong> uploaded Bank Statement</p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p><strong>Premier Logistics Group</strong> documents approved</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Static Vice International partner data
  const partnerData = {
    companyName: 'Vice International',
    email: 'partner@viceinternational.com',
    contactName: 'John Smith',
    contactPhone: '+1-555-0123'
  };

  const handleLogout = () => {
    // Static logout - just navigate to login
    navigate('/partner/login');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/partner/dashboard' },
    { id: 'customers', label: 'Customers', icon: '👥', path: '/partner/dashboard/customers' },
    { id: 'configuration', label: 'Configuration', icon: '⚙️', path: '/partner/dashboard/configuration' },
  ];

  return (
    <div className="partner-dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Vice International</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {partnerData.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{partnerData.contactName}</p>
              <p className="user-email">{partnerData.email}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-header">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </span>
          </div>
        </div>

        <div className="content-body">
          <Routes>
            <Route path="/" element={<PartnerDashboardOverview />} />
            <Route path="/customers" element={<PartnerCustomers />} />
            <Route path="/configuration" element={<PartnerConfiguration />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;