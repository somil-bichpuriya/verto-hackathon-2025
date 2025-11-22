import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Shield } from 'lucide-react';

function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      description: 'For small partnerships and growing businesses.',
      price: '$199',
      period: 'month',
      features: [
        'Access to 100 Verified Customer Profiles',
        'Basic Customer Search & Filtering',
        'Standard API Integration',
        'Email Support',
        'Basic Analytics Dashboard'
      ],
      popular: false,
      cta: 'Start Starter Plan',
      color: 'blue'
    },
    {
      name: 'Professional',
      description: 'For established businesses with multiple partnerships.',
      price: '$499',
      period: 'month',
      features: [
        'Access to 1,000 Verified Customer Profiles',
        'Advanced Search & Filtering',
        'Full API Integration',
        'Priority Support',
        'Advanced Analytics & Reporting',
        'Custom Integration Support',
        'Webhook Notifications'
      ],
      popular: true,
      cta: 'Start Professional Plan',
      color: 'purple'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with extensive partner networks.',
      price: 'Custom',
      period: 'pricing',
      features: [
        'Unlimited Verified Customer Profiles',
        'White-label Integration',
        'Dedicated Account Manager',
        'Custom SLA & Support',
        'Advanced Security Features',
        'Bulk Data Access',
        'Custom Reporting & Analytics'
      ],
      popular: false,
      cta: 'Contact Enterprise Sales',
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; button: string }> = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Verto</span>
            </Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Partner Pricing Plans
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Access pre-verified customer profiles and accelerate your onboarding process.
            Pay once, access verified customers instantly across all your business relationships.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => {
              const colors = getColorClasses(tier.color);
              return (
                <div
                  key={tier.name}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                    tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-6">{tier.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                      {tier.period !== 'pricing' && (
                        <span className="text-gray-600">/{tier.period}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`w-5 h-5 ${colors.text} mr-3 mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={tier.name === 'Enterprise' ? '/contact' : '/customer/login'}
                    className={`w-full ${colors.button} text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Partner Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your customer onboarding volume and integration needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Verified Customer Profiles</td>
                  <td className="text-center py-4 px-6 text-gray-700">100</td>
                  <td className="text-center py-4 px-6 text-gray-700">1,000</td>
                  <td className="text-center py-4 px-6 text-gray-700">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Search & Filtering</td>
                  <td className="text-center py-4 px-6 text-gray-700">Basic</td>
                  <td className="text-center py-4 px-6 text-gray-700">Advanced</td>
                  <td className="text-center py-4 px-6 text-gray-700">Advanced</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">API Integration</td>
                  <td className="text-center py-4 px-6 text-gray-700">Standard</td>
                  <td className="text-center py-4 px-6 text-gray-700">Full</td>
                  <td className="text-center py-4 px-6 text-gray-700">White-label</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Support Level</td>
                  <td className="text-center py-4 px-6 text-gray-700">Email</td>
                  <td className="text-center py-4 px-6 text-gray-700">Priority</td>
                  <td className="text-center py-4 px-6 text-gray-700">Dedicated</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Analytics & Reporting</td>
                  <td className="text-center py-4 px-6 text-gray-700">Basic</td>
                  <td className="text-center py-4 px-6 text-gray-700">Advanced</td>
                  <td className="text-center py-4 px-6 text-gray-700">Custom</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Webhook Notifications</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Custom Integration Support</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Bulk Data Access</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Account Manager</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6 text-gray-400">—</td>
                  <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the customer verification process work?
              </h3>
              <p className="text-gray-600">
                Customers create digital business wallets on Verto, upload their documents, and our expert team
                verifies them once. Once verified, partners can access these pre-verified profiles instantly
                through our API or dashboard, eliminating repetitive onboarding.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What types of documents are typically verified?
              </h3>
              <p className="text-gray-600">
                We verify business registration documents, tax certificates, financial statements, identity
                documents for key personnel, and any other compliance-related documents required for
                business partnerships and transactions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How quickly can I access verified customer data?
              </h3>
              <p className="text-gray-600">
                Once a customer is verified by our team, their profile becomes immediately available to all
                subscribed partners. The verification process typically takes 24-48 hours, but can be
                expedited for urgent cases.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is the data secure and compliant?
              </h3>
              <p className="text-gray-600">
                Yes, we maintain bank-level security with full GDPR compliance, SOC 2 certification, and
                enterprise-grade encryption. Partners only access the data they need for their specific
                business relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Customer Onboarding?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Stop wasting time on repetitive verification processes. Access pre-verified customer profiles
            instantly and focus on growing your business relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/partner/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="ml-2 text-lg font-bold">Verto</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Verto. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;