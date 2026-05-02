import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgreement, getPayments, createPayment } from '../services/api';
import { showSuccess, showError } from '../components/NotificationToast';
import { useUser } from '../context/UserContext';

const AgreementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const actualUser = user?.user || user;
  
  const [agreement, setAgreement] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchAgreementDetails();
  }, [id]);

  const fetchAgreementDetails = async () => {
    try {
      const agreementData = await getAgreement(id);
      setAgreement(agreementData);
      
      const paymentsData = await getPayments(id);
      setPayments(paymentsData);
    } catch (error) {
      showError('Failed to load agreement details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      showError('Please enter a valid payment amount.');
      return;
    }

    try {
      const payment = {
        agreementId: id,
        amount: parseFloat(paymentData.amount),
        notes: paymentData.notes
      };
      
      await createPayment(payment);
      showSuccess('Payment recorded successfully!');
      
      // Reset form and refresh
      setPaymentData({ amount: '', notes: '' });
      setShowPaymentForm(false);
      
      // Refresh agreement and payments
      fetchAgreementDetails();
    } catch (error) {
      showError(error.message || 'Failed to record payment.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Active</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Pending</span>;
      case 'COMPLETED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Completed</span>;
      case 'DEFAULTED':
        return <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Defaulted</span>;
      case 'REJECTED':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotalPaid = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateRemainingBalance = () => {
    if (!agreement) return 0;
    return agreement.amount - calculateTotalPaid();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isLender = agreement.lenderId === actualUser.id;
  const isBorrower = agreement.borrowerId === actualUser.id;
  const canRecordPayment = isBorrower && agreement.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agreement Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Agreement Details</h2>
                {getStatusBadge(agreement.status)}
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lender</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{agreement.lender?.name}</p>
                    <p className="text-sm text-gray-600">{agreement.lender?.phone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Borrower</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{agreement.borrower?.name}</p>
                    <p className="text-sm text-gray-600">{agreement.borrower?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Loan Amount</span>
                    <p className="text-xl font-bold text-gray-900">KES {agreement.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <p className="text-xl font-bold text-gray-900">{agreement.interestRate}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Due Date</span>
                    <p className="text-xl font-bold text-gray-900">{formatDate(agreement.dueDate)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status</span>
                    <p className="text-xl font-bold text-gray-900">{getStatusBadge(agreement.status)}</p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{agreement.terms}</p>
                </div>
              </div>

              {/* Blockchain Verification */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Blockchain Verification</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-blue-700">Agreement Hash:</span>
                    <p className="font-mono text-xs text-blue-900 break-all">{agreement.hash}</p>
                  </div>
                  {agreement.hederaTxId && (
                    <div>
                      <span className="text-sm text-blue-700">Transaction ID:</span>
                      <p className="font-mono text-xs text-blue-900 break-all">{agreement.hederaTxId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Loan</span>
                  <span className="font-medium text-gray-900">KES {agreement.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Paid</span>
                  <span className="font-medium text-green-600">KES {calculateTotalPaid().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining Balance</span>
                  <span className="font-medium text-orange-600">KES {calculateRemainingBalance().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Record Payment Form */}
            {canRecordPayment && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
                  {!showPaymentForm && (
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add Payment
                    </button>
                  )}
                </div>

                {showPaymentForm ? (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Amount (KES) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Notes
                      </label>
                      <textarea
                        rows="3"
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter payment details or notes"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Record Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            )}

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No payments recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border-b border-gray-200 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">KES {payment.amount.toLocaleString()}</p>
                          {payment.notes && (
                            <p className="text-sm text-gray-600 mt-1">{payment.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementDetails;
