import { Link } from 'react-router-dom';
import { Users, Shield, Building2, ArrowRight, CheckCircle } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Verto</span>
            </div>
            <nav className="flex space-x-8">
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Accelerate Customer
            <span className="text-blue-600"> Onboarding</span>
            <br />
            with Digital Identity
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Create verified customer profiles with digital business wallets. Upload documents once,
            get verified by our expert team, and seamlessly share with partners to eliminate
            repetitive onboarding processes.
          </p>

          {/* Login Options */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Customer Portal */}
            <Link
              to="/customer/login"
              className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Portal</h3>
              <p className="text-gray-600 mb-6">
                Create your digital business wallet, upload documents, and get verified once.
                Share seamlessly with all your partners.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Get Your Digital Wallet
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Partner Portal */}
            <Link
              to="/partner/login"
              className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Partner Portal</h3>
              <p className="text-gray-600 mb-6">
                Access pre-verified customer profiles instantly. Eliminate repetitive onboarding
                and reduce time-to-value for your customers.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                Access Verified Customers
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Admin Dashboard */}
            <Link
              to="/login"
              className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Manage verifications, oversee partner relationships, and monitor platform
                performance across all customers and partners.
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                Platform Management
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Verto Accelerates Onboarding
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your customer onboarding from weeks to minutes with our digital identity platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Business Wallets</h3>
              <p className="text-gray-600">
                Customers create secure digital identities with all their business documents
                in one centralized, verified location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">One-Time Verification</h3>
              <p className="text-gray-600">
                Our expert team verifies documents once. Customers never need to repeat
                the verification process with different partners.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Partner Integration</h3>
              <p className="text-gray-600">
                Partners pay to access pre-verified customer profiles, eliminating repetitive
                onboarding and reducing time-to-value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Onboarding?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the digital identity revolution. Create verified customer profiles once,
            share everywhere, and eliminate repetitive onboarding processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Partner Pricing
            </Link>
            <Link
              to="/customer/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Digital Wallet
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

export default HomePage;