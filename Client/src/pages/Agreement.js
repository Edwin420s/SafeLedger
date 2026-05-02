import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgreement, verifyAgreement, getPayments, createPayment } from '../services/api';
import { showError, showSuccess } from '../components/NotificationToast';
import { useUser } from '../context/UserContext';
import PaymentForm from '../components/PaymentForm';
import BlockchainVerification from '../components/BlockchainVerification';

const Agreement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [agreement, setAgreement] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchAgreement();
      fetchPayments();
    } else {
      navigate('/dashboard');
    }
  }, [id]);

  const fetchAgreement = async () => {
    try {
      const data = await getAgreement(id);
      setAgreement(data);
    } catch (err) {
      showError('Agreement not found.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await getPayments(id);
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const handlePaymentCreated = (newPayment) => {
    setPayments(prev => [...prev, newPayment]);
    // Update agreement status if needed
    if (agreement) {
      setAgreement(prev => ({
        ...prev,
        status: 'ACTIVE'
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
      case 'COMPLETED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>;
      case 'DEFAULTED':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Defaulted</span>;
      case 'REJECTED':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{status}</span>;
    }
  };

  const calculateRemainingBalance = () => {
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return Math.max(0, agreement.amount - totalPaid);
  };

  const calculateDaysOverdue = () => {
    if (agreement.status !== 'ACTIVE') return 0;
    const dueDate = new Date(agreement.dueDate);
    const today = new Date();
    const diffTime = today - dueDate;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Agreement not found.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Agreement Details</h1>
              <p className="text-gray-600 mt-1">
                Agreement ID: {agreement.id}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(agreement.status)}
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {['details', 'payments', 'verification'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">
                            KES {agreement.amount?.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2">{getStatusBadge(agreement.status)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">{agreement.interestRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">
                            {formatDate(agreement.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">Financial Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Original Amount:</span>
                          <span className="font-bold text-blue-900">KES {agreement.amount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Total Paid:</span>
                          <span className="font-bold text-blue-900">
                            KES {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Remaining Balance:</span>
                          <span className="font-bold text-blue-900">
                            KES {calculateRemainingBalance().toLocaleString()}
                          </span>
                        </div>
                        {calculateDaysOverdue() > 0 && (
                          <div className="flex justify-between">
                            <span className="text-red-700">Days Overdue:</span>
                            <span className="font-bold text-red-900">{calculateDaysOverdue()} days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Terms & Conditions</h3>
                      <p className="text-yellow-800 whitespace-pre-wrap">{agreement.terms}</p>
                    </div>

                    {/* Blockchain Info */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-4">Blockchain Information</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-purple-700">SHA-256 Hash:</span>
                          <div className="mt-1 p-3 bg-white rounded border border-purple-200 font-mono text-xs break-all">
                            {agreement.hash}
                          </div>
                        </div>
                        <div>
                          <span className="text-purple-700">Hedera Transaction:</span>
                          <div className="mt-1 p-3 bg-white rounded border border-purple-200 font-mono text-xs break-all">
                            {agreement.hederaTxId || 'Pending...'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
                    {payments.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600">No payments recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {payments.map((payment, index) => (
                          <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Payment #{index + 1}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {formatDate(payment.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-bold text-green-600">
                                  +KES {payment.amount?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {payment.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-sm text-gray-600">Notes: {payment.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Verification Tab */}
                {activeTab === 'verification' && (
                  <BlockchainVerification agreement={agreement} />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {agreement.status === 'ACTIVE' && (
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Record Payment
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('verification')}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Verify on Blockchain
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Print Agreement
                </button>
              </div>
            </div>

            {/* Payment Form */}
            {agreement.status === 'ACTIVE' && activeTab === 'payments' && (
              <PaymentForm 
                agreementId={agreement.id} 
                onPaymentCreated={handlePaymentCreated} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreement;