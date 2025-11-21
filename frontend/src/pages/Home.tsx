import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Verto</span>
          </div>
          <div className="nav-links">
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <div className="login-dropdown">
              <button className="nav-link login-btn">Login ▾</button>
              <div className="dropdown-menu">
                <Link to="/login/customer" className="dropdown-item">👤 Customer Login</Link>
                <Link to="/login/partner" className="dropdown-item">🤝 Partner Login</Link>
                <Link to="/login/admin" className="dropdown-item">🛡️ Admin Login</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Secure Document Verification
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>
          <p className="hero-subtitle">
            Empower your business with seamless document access and verification.
            Built for compliance, security, and trust.
          </p>
          <div className="hero-buttons">
            <Link to="/register/customer" className="btn-primary">
              Register as Customer
            </Link>
            <Link to="/register/partner" className="btn-secondary">
              Register as Partner
            </Link>
          </div>
          <div className="login-links">
            <span>Already have an account?</span>
            <Link to="/login/customer" className="login-link">Customer Login</Link>
            <span>•</span>
            <Link to="/login/partner" className="login-link">Partner Login</Link>
            <span>•</span>
            <Link to="/login/admin" className="login-link">Admin Login</Link>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">📄</div>
            <div>Document Upload</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">✅</div>
            <div>Verification</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🔒</div>
            <div>Secure Access</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose Verto?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3>Secure & Compliant</h3>
            <p>Enterprise-grade security with full audit trails and compliance support</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#48bb7820', color: '#48bb78' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Fast Integration</h3>
            <p>Simple REST API that gets you up and running in minutes</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#764ba220', color: '#764ba2' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Consent-Based Access</h3>
            <p>Customers control who accesses their documents with granular permissions</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of businesses streamlining their verification process</p>
          <Link to="/pricing" className="cta-button">
            View Pricing Plans
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Verto</h4>
            <p>Secure document verification platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/pricing">Pricing</a>
            <a href="/register/customer">Customer Registration</a>
            <a href="/register/partner">Partner Registration</a>
          </div>
          <div className="footer-section">
            <h4>Login</h4>
            <a href="/login/customer">Customer Login</a>
            <a href="/login/partner">Partner Login</a>
            <a href="/login/admin">Admin Login</a>
          </div>
          <div className="footer-section">
            <h4>Admin</h4>
            <a href="/admin">Dashboard</a>
            <a href="/admin/customers">Customers</a>
            <a href="/admin/partners">Partners</a>
            <a href="/admin/verification">Verification Queue</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Verto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
