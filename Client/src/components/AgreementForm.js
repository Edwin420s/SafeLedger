import React, { useState } from 'react';
import { createAgreement } from '../services/api';
import { showSuccess, showError } from './NotificationToast';

const AgreementForm = ({ onAgreementCreated }) => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    amount: '',
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
      const newAgreement = await createAgreement(formData);
      showSuccess('Agreement created and anchored on Hedera!');
      onAgreementCreated?.(newAgreement);
      setFormData({ borrowerName: '', amount: '', dueDate: '', terms: '' });
    } catch (err) {
      showError('Failed to create agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Create New Loan Agreement</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="borrowerName">
          Borrower Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="borrowerName"
          name="borrowerName"
          type="text"
          placeholder="Enter borrower's name"
          value={formData.borrowerName}
          onChange={handleChange}
          required
        />
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
          min="1"
          placeholder="e.g. 5000"
          value={formData.amount}
          onChange={handleChange}
          required
        />
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
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="terms">
          Terms / Conditions
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="terms"
          name="terms"
          rows="3"
          placeholder="e.g. Interest, repayment schedule..."
          value={formData.terms}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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