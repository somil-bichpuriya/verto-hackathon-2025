import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const pricingTiers = [
    {
      name: 'Standard',
      description: 'For small-scale verification',
      price: '$99',
      period: '/month',
      features: [
        'API Access',
        '50 Document Fetches/Month',
        '1 Configured Document Type',
        'Basic Support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For growing businesses',
      price: '$499',
      period: '/month',
      features: [
        'All Standard features',
        '500 Document Fetches/Month',
        'Unlimited Configured Document Types',
        'Priority Support',
        'Webhook Notifications',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For high-volume global operations',
      price: 'Custom',
      period: '',
      features: [
        'All Pro features',
        'Unlimited Fetches',
        'Dedicated Account Manager',
        'Custom Service Level Agreement (SLA)',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <Link to="/" className="back-home">← Back to Home</Link>
        <h1>Verto Partner Pricing</h1>
        <p className="subtitle">
          Choose the plan that fits your verification needs
        </p>
      </div>

      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
          >
            {tier.highlighted && <div className="badge">Most Popular</div>}
            
            <div className="card-header">
              <h2>{tier.name}</h2>
              <p className="description">{tier.description}</p>
            </div>

            <div className="price-section">
              <span className="price">{tier.price}</span>
              {tier.period && <span className="period">{tier.period}</span>}
            </div>

            <ul className="features-list">
              {tier.features.map((feature, index) => (
                <li key={index}>
                  <svg
                    className="check-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/register/partner"
              className={`cta-button ${tier.highlighted ? 'primary' : 'secondary'}`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="pricing-footer">
        <p>
          <Link to="/" className="link">
            ← Back to Home
          </Link>
          {' • '}
          <Link to="/login/partner" className="link">
            Partner Login
          </Link>
        </p>
        <p>
          Already a customer?{' '}
          <Link to="/login/customer" className="link">
            Customer Login
          </Link>
          {' or '}
          <Link to="/register/customer" className="link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
