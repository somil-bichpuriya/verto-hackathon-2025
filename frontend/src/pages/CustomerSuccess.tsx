import { useLocation, useNavigate } from 'react-router-dom';
import './CustomerSuccess.css';

const CustomerSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  if (!customer) {
    navigate('/register/customer');
    return null;
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1>Registration Successful!</h1>
        <p className="success-message">
          Welcome to Verto, {customer.companyName}
        </p>

        <div className="customer-info">
          <div className="info-item">
            <span className="label">Customer ID:</span>
            <span className="value">{customer.id}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{customer.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Address:</span>
            <span className="value">{customer.address}</span>
          </div>
        </div>

        <div className="next-steps">
          <h2>Next Steps</h2>
          <ol>
            <li>Check your email for confirmation</li>
            <li>Upload your documents using your registered email</li>
            <li>Partners will request consent to access your documents</li>
            <li>Review and grant consent as needed</li>
          </ol>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/pricing')} className="primary-button">
            View Partner Pricing
          </button>
          <button onClick={() => navigate('/')} className="secondary-button">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSuccess;
