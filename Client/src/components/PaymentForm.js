import React, { useState } from 'react';
import { createPayment } from '../services/api';
import { showSuccess, showError } from './NotificationToast';

const PaymentForm = ({ agreementId, onPaymentCreated }) => {
  const [formData, setFormData] = useState({
    amount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Payment amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        agreementId,
        amount: parseFloat(formData.amount),
        notes: formData.notes
      };
      
      const newPayment = await createPayment(paymentData);
      showSuccess('Payment recorded successfully!');
      onPaymentCreated?.(newPayment);
      
      // Reset form
      setFormData({ amount: '', notes: '' });
      setErrors({});
    } catch (err) {
      console.error('Payment creation error:', err);
      showError(err.message || 'Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">💰</span>
          Record Payment
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Record a payment for this agreement. This will update the agreement balance and payment history.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Payment Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount (KES) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">💵</span>
            </div>
            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="1000.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Payment Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Notes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <span className="text-gray-500">📝</span>
            </div>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional notes about this payment (e.g., 'Monthly payment for March 2026')"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required field
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recording Payment...
              </>
            ) : (
              <>
                Record Payment
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* M-Pesa Integration Notice */}
      <div className="bg-green-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2M3 9v9m0 0h9m-9 4h9m-1.5-1.5h3m3 0l-4-4m4 4" />
            </svg>
          </div>
          <div className="text-sm text-green-800">
            <strong className="font-medium">M-Pesa Integration:</strong> Payment records can be integrated 
            with M-Pesa for automatic processing and SMS notifications.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
