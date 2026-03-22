import React, { useState, useEffect } from 'react';
import AgreementForm from '../components/AgreementForm';
import LoanList from '../components/LoanList';
import { useUser } from '../context/UserContext';
import { getAgreements } from '../services/api';

const Dashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalAgreements: 0,
    activeAgreements: 0,
    completedAgreements: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const agreements = await getAgreements();
        const stats = {
          totalAgreements: agreements.length,
          activeAgreements: agreements.filter(a => a.status === 'ACTIVE').length,
          completedAgreements: agreements.filter(a => a.status === 'COMPLETED').length,
          totalValue: agreements
            .filter(a => a.status === 'ACTIVE' || a.status === 'COMPLETED')
            .reduce((sum, a) => sum + a.amount, 0)
        };
        setStats(stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAgreementCreated = (newAgreement) => {
    // Update stats
    setStats(prev => ({
      ...prev,
      totalAgreements: prev.totalAgreements + 1,
      activeAgreements: prev.activeAgreements + 1,
      totalValue: prev.totalValue + newAgreement.amount
    }));
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name || 'User'}! 👋
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m8 0v8m0 0l-4-4m4 4l4 4" />
              </svg>
              {showForm ? 'Hide Form' : 'Create Agreement'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agreements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgreements}</p>
              </div>
              <div className="text-3xl text-blue-500">📝</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAgreements}</p>
              </div>
              <div className="text-3xl text-green-500">💰</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedAgreements}</p>
              </div>
              <div className="text-3xl text-purple-500">✅</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">KES {stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="text-3xl text-orange-500">📈</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agreement Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Agreement</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <AgreementForm onAgreementCreated={handleAgreementCreated} />
              </div>
            </div>
          )}

          {/* Loan List */}
          <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Agreements</h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m8 0v8m0 0l-4-4m4 4l4 4" />
                    </svg>
                    New Agreement
                  </button>
                )}
              </div>
              <LoanList />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-blue-100 mb-6">
                Check out our comprehensive user guide or contact support for assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/docs/USER_GUIDE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  📖 User Guide
                </a>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors font-medium">
                  💬 Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;