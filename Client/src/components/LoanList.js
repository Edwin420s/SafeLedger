import React, { useEffect, useState } from 'react';
import { getUserAgreements } from '../services/api';
import { showError } from './NotificationToast';

const LoanList = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      const data = await getUserAgreements();
      setAgreements(data);
    } catch (err) {
      showError('Failed to load agreements.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Active</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Pending</span>;
      case 'DEFAULTED':
        return <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Defaulted</span>;
      case 'COMPLETED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{status}</span>;
    }
  };

  if (loading) return <div className="text-center py-4">Loading your agreements...</div>;

  if (agreements.length === 0) {
    return (
      <div className="bg-white shadow-md rounded p-6 text-center text-gray-500">
        No agreements yet. Create your first loan agreement above.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">Your Loan Agreements</h2>
      <div className="space-y-4">
        {agreements.map((agreement) => (
          <div key={agreement.id} className="border rounded p-4 hover:shadow transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{agreement.borrower?.name || agreement.borrowerId}</p>
                <p className="text-sm text-gray-600">KES {agreement.amount}</p>
                <p className="text-xs text-gray-500">Due: {new Date(agreement.dueDate).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-1">Hedera Tx: {agreement.hederaTxId || 'Pending'}</p>
              </div>
              <div>
                {getStatusBadge(agreement.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanList;