import React, { useState } from 'react';
import { createAgreement } from '../services/api';
import { showSuccess, showError } from './NotificationToast';
import { useUser } from '../context/UserContext';

const AgreementForm = ({ onAgreementCreated }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    lenderId: user?.id || '',
    borrowerId: '',
    amount: '',
    interestRate: '5.0',
    penaltyRate: '2.0',
    dueDate: '',
    terms: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.id) {
        showError('User not authenticated. Please log in again.');
        return;
      }
      
      const agreementData = {
        ...formData,
        lenderId: user.id,
        amount: parseFloat(formData.amount), // Convert to number
      };
      
      console.log('Submitting agreement data:', agreementData);
      const newAgreement = await createAgreement(agreementData);
      showSuccess('Agreement created and anchored on Hedera!');
      onAgreementCreated?.(newAgreement);
      setFormData({ 
        lenderId: user.id,
        borrowerId: '', 
        amount: '',
        interestRate: '5.0',
        penaltyRate: '2.0',
        dueDate: '', 
        terms: '' 
      });
    } catch (err) {
      console.error('Agreement creation error:', err);
      showError(err.message || 'Failed to create agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Create New Loan Agreement</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="borrowerId">
          Borrower Phone Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="borrowerId"
          name="borrowerId"
          type="tel"
          placeholder="Enter borrower's phone number (e.g., 0712345678)"
          value={formData.borrowerId}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Note: The borrower must be a registered user with this phone number
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount (KES)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount"
          name="amount"
          type="number"
          placeholder="5000"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interestRate">
            Interest Rate (%)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="interestRate"
            name="interestRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.interestRate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="penaltyRate">
            Penalty Rate (%)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="penaltyRate"
            name="penaltyRate"
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={formData.penaltyRate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
          Due Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="dueDate"
          name="dueDate"
          type="date"
          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Minimum tomorrow
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="terms">
          Terms
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="terms"
          name="terms"
          placeholder="Enter loan terms and conditions"
          value={formData.terms}
          onChange={handleChange}
          rows="4"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Agreement'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        * A hash of this agreement will be stored immutably on the Hedera network.
      </p>
    </form>
  );
};

export default AgreementForm;