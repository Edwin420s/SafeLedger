import React, { useState } from 'react';
import { createAgreement } from '../services/api';
import { showSuccess, showError } from './NotificationToast';
import { useUser } from '../context/UserContext';

const AgreementForm = ({ onAgreementCreated }) => {
  const { user, token } = useUser();
  const actualUser = user?.user || user; // Handle both structures
  console.log('AgreementForm - User context:', { user, token });
  console.log('Actual user object:', actualUser);
  
  const [formData, setFormData] = useState({
    lenderId: actualUser?.id || '',
    borrowerId: '',
    amount: '',
    interestRate: '5.0',
    penaltyRate: '2.0',
    dueDate: '',
    terms: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update lenderId when user changes
  React.useEffect(() => {
    if (actualUser?.id) {
      setFormData(prev => ({ ...prev, lenderId: actualUser.id }));
      console.log('Updated lenderId to:', actualUser.id);
    }
  }, [actualUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    console.log('=== VALIDATION START ===');
    const newErrors = {};
    
    if (!formData.borrowerId.trim()) {
      newErrors.borrowerId = 'Borrower phone number is required';
    } else if (!/^(\+254|0)?[17]\d{8}$/.test(formData.borrowerId.replace(/\s/g, ''))) {
      newErrors.borrowerId = 'Please enter a valid Kenyan phone number';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Loan amount must be greater than 0';
    } else if (parseFloat(formData.amount) > 10000000) {
      newErrors.amount = 'Loan amount cannot exceed KES 10,000,000';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }
    
    if (!formData.terms.trim()) {
      newErrors.terms = 'Loan terms are required';
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Is valid:', isValid);
    console.log('=== VALIDATION END ===');
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', formData);
    console.log('User context:', { user, token });
    console.log('Actual user:', actualUser);
    console.log('User ID:', actualUser?.id);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    console.log('Form validation passed');

    setLoading(true);
    try {
      if (!actualUser || !actualUser.id) {
        console.log('User authentication check failed - actualUser:', actualUser);
        showError('User not authenticated. Please log in again.');
        return;
      }
      console.log('User authentication passed');
      
      const agreementData = {
        ...formData,
        lenderId: actualUser.id,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        penaltyRate: parseFloat(formData.penaltyRate),
      };
      
      console.log('Sending agreement data:', agreementData);
      const newAgreement = await createAgreement(agreementData);
      console.log('Agreement created:', newAgreement);
      showSuccess('Agreement created and anchored on Hedera blockchain!');
      onAgreementCreated?.(newAgreement);
      
      // Reset form
      setFormData({ 
        lenderId: actualUser.id,
        borrowerId: '', 
        amount: '',
        interestRate: '5.0',
        penaltyRate: '2.0',
        dueDate: '', 
        terms: '' 
      });
      setErrors({});
    } catch (err) {
      console.error('Agreement creation error:', err);
      showError(err.message || 'Failed to create agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.amount) || 0;
    const annualRate = parseFloat(formData.interestRate) || 0;
    const monthlyRate = annualRate / 12 / 100;
    return principal * monthlyRate;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📝</span>
          Create New Loan Agreement
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Fill in the loan details below. All agreements are verified on the Hedera blockchain for security.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Borrower Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="borrowerId" className="block text-sm font-medium text-gray-700 mb-2">
              Borrower Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🇰🇪</span>
              </div>
              <input
                id="borrowerId"
                name="borrowerId"
                type="tel"
                required
                value={formData.borrowerId}
                onChange={handleChange}
                className={`appearance-none block w-full pl-12 pr-3 py-3 border ${
                  errors.borrowerId ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="+254 712 345 678"
              />
            </div>
            {errors.borrowerId && (
              <p className="mt-1 text-xs text-red-600">{errors.borrowerId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The borrower must be a registered SafeLedger user
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Quick Calculation</h4>
            {formData.amount && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Loan Amount:</span>
                  <span className="font-bold text-blue-900">KES {parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Monthly Interest:</span>
                  <span className="font-bold text-blue-900">KES {calculateMonthlyPayment().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Interest Rate:</span>
                  <span className="font-bold text-blue-900">{formData.interestRate}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (KES) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">💰</span>
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                min="100"
                max="10000000"
                step="100"
                required
                value={formData.amount}
                onChange={handleChange}
                className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="5000"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">📈</span>
              </div>
              <input
                id="interestRate"
                name="interestRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={formData.interestRate}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Annual interest rate (e.g., 5.0 for 5% per year)
            </p>
          </div>

          <div>
            <label htmlFor="penaltyRate" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Penalty Rate (%)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">⚠️</span>
              </div>
              <input
                id="penaltyRate"
                name="penaltyRate"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.penaltyRate}
                onChange={handleChange}
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Monthly penalty rate for late payments
            </p>
          </div>
        </div>

        {/* Date and Terms */}
        <div className="space-y-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">📅</span>
              </div>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
                value={formData.dueDate}
                onChange={handleChange}
                className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
              Loan Terms & Conditions <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                <span className="text-gray-500">📄</span>
              </div>
              <textarea
                id="terms"
                name="terms"
                rows="4"
                required
                value={formData.terms}
                onChange={handleChange}
                className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                  errors.terms ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter the loan terms, repayment schedule, collateral requirements, etc."
              />
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-600">{errors.terms}</p>
            )}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            {showAdvanced ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide Advanced Options
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                </svg>
                Show Advanced Options
              </>
            )}
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Agreement...
              </>
            ) : (
              <>
                Create Agreement
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 2-2m0 0l-2-2m6 0l-2 2m0 0l-2-2m7 2v-10a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="bg-blue-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10 10V7a4 4 0 00-8 0v8a4 4 0 008 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <strong className="font-medium">Blockchain Verification:</strong> This agreement will be hashed and 
            stored on the Hedera blockchain for complete immutability and verification.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementForm;