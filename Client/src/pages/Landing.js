import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Landing = () => {
  const { user } = useUser();

  const features = [
    {
      icon: '🔐',
      title: 'Secure & Trustworthy',
      description: 'Military-grade encryption and blockchain verification ensure your agreements are tamper-proof.'
    },
    {
      icon: '⚡',
      title: 'Instant Verification',
      description: 'Verify any agreement on Hedera blockchain in seconds with cryptographic proof.'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Built for Kenya with phone-based authentication and KES currency support.'
    },
    {
      icon: '🌍',
      title: 'Local Context',
      description: 'Designed for informal finance systems like chamas, SACCOs, and community lending.'
    },
    {
      icon: '📊',
      title: 'Trust Scoring',
      description: 'Build your reputation through successful transactions and timely repayments.'
    },
    {
      icon: '💰',
      title: 'M-Pesa Integration',
      description: 'Seamless payment processing with Kenya\'s leading mobile money service.'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Kenyans in Informal Finance' },
    { number: '85%', label: 'Trust Issues in Lending' },
    { number: '2.5M', label: 'Daily M-Pesa Transactions' },
    { number: '100%', label: 'Blockchain Verified' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Trust in
              <span className="text-blue-600"> Informal Finance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Secure loan agreements with blockchain verification. Built for Kenya, powered by Hedera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SafeLedger?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the Kenyan market with enterprise-grade security and blockchain technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How SafeLedger Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to create secure, blockchain-verified loan agreements.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Register with your phone number and create your secure profile.',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Create Agreement',
                description: 'Fill in loan terms and submit for blockchain verification.',
                icon: '📝'
              },
              {
                step: '03',
                title: 'Get Verification',
                description: 'Agreement hash is stored on Hedera for immutability.',
                icon: '⛓'
              },
              {
                step: '04',
                title: 'Manage & Track',
                description: 'Record payments and monitor agreement status in real-time.',
                icon: '📊'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                  <div className="text-3xl font-bold text-blue-600 mb-4">{step.step}</div>
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414 1.414L10 11.586l8 8a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L10 8.414l-8-8a1 1 0 00-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AES-256 Encryption</h3>
                    <p className="text-gray-600">Military-grade encryption for all sensitive data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414 1.414L10 11.586l8 8a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L10 8.414l-8-8a1 1 0 00-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hedera Blockchain</h3>
                    <p className="text-gray-600">Immutable agreement verification and timestamping</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 00-1.414 1.414L10 11.586l8 8a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L10 8.414l-8-8a1 1 0 00-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">JWT Authentication</h3>
                    <p className="text-gray-600">Secure token-based session management</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-xl text-white">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">🔒</div>
                <h3 className="text-2xl font-bold mb-4">Your Data is Safe</h3>
                <p className="text-blue-100 mb-6">
                  Every agreement is encrypted and verified on the Hedera blockchain, 
                  ensuring complete immutability and trust.
                </p>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-sm text-blue-100">
                    <div className="font-semibold mb-2">Security Features:</div>
                    <ul className="space-y-1 text-left">
                      <li>• End-to-end encryption</li>
                      <li>• Blockchain verification</li>
                      <li>• Secure authentication</li>
                      <li>• Rate limiting protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Informal Finance?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans building trust through blockchain-verified agreements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      </div>
  );
};

export default Landing;
