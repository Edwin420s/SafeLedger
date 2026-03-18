import React, { useEffect, useState } from 'react';
import { getUserAgreements, acceptAgreement, rejectAgreement } from '../services/api';
import { showError, showSuccess } from './NotificationToast';
import { useUser } from '../context/UserContext';

const LoanList = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

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

  const handleAccept = async (id) => {
    try {
      await acceptAgreement(id);
      showSuccess('Agreement accepted successfully!');
      fetchAgreements(); // Refresh list
    } catch (err) {
      showError(err.message || 'Failed to accept agreement.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAgreement(id);
      showSuccess('Agreement rejected.');
      fetchAgreements(); // Refresh list
    } catch (err) {
      showError(err.message || 'Failed to reject agreement.');
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
      case 'REJECTED':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{status}</span>;
    }
  };

  const getDisplayName = (agreement) => {
    // Determine if current user is lender or borrower and show the other party
    const isLender = agreement.lenderId === user.id;
    const otherParty = isLender ? agreement.borrower : agreement.lender;
    const role = isLender ? 'Borrower' : 'Lender';
    
    const name = otherParty?.name || otherParty?.phone || 'Unknown';
    return `${role}: ${name}`;
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
        {agreements.map((agreement) => {
          const isBorrower = agreement.borrowerId === user.id;
          const canAcceptReject = isBorrower && agreement.status === 'PENDING';
          
          return (
            <div key={agreement.id} className="border rounded p-4 hover:shadow transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{getDisplayName(agreement)}</p>
                  <p className="text-sm text-gray-600">KES {agreement.amount}</p>
                  <p className="text-xs text-gray-500">
                    Interest: {agreement.interestRate}% | Penalty: {agreement.penaltyRate}%
                  </p>
                  <p className="text-xs text-gray-500">Due: {new Date(agreement.dueDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Hedera Tx: {agreement.hederaTxId || 'Pending'}</p>
                  {canAcceptReject && (
                    <div className="mt-3 space-x-2">
                      <button
                        onClick={() => handleAccept(agreement.id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(agreement.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  {getStatusBadge(agreement.status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanList;