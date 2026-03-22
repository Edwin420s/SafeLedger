import React, { useEffect, useState } from 'react';
import { getUserAgreements, acceptAgreement, rejectAgreement } from '../services/api';
import { showError, showSuccess } from './NotificationToast';
import { useUser } from '../context/UserContext';

const LoanList = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
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
      fetchAgreements();
    } catch (err) {
      showError(err.message || 'Failed to accept agreement.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAgreement(id);
      showSuccess('Agreement rejected.');
      fetchAgreements();
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

  const filteredAndSortedAgreements = agreements
    .filter(agreement => {
      if (filter === 'all') return true;
      if (filter === 'lending') return agreement.lenderId === user.id;
      if (filter === 'borrowing') return agreement.borrowerId === user.id;
      return false;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📋</span>
            Your Agreements
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {agreements.length}
            </span>
          </h3>
          
          {/* Filters and Sort */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Agreements</option>
                <option value="lending">Lending</option>
                <option value="borrowing">Borrowing</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredAndSortedAgreements.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-4-4h8v8m0 0l-4-4m4 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agreements found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' && 'Create your first agreement or adjust your filters.'}
              {filter === 'lending' && 'No lending agreements found. Start by creating your first loan agreement.'}
              {filter === 'borrowing' && 'No borrowing agreements found. Check back for agreements where you are the borrower.'}
            </p>
            <button
              onClick={() => setFilter('all')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Agreements
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedAgreements.map((agreement) => (
              <div key={agreement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {agreement.lenderId === user.id ? 'Lending to' : 'Borrowing from'} {agreement.borrowerName || agreement.lenderName}
                      </h4>
                      {getStatusBadge(agreement.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(agreement.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      KES {agreement.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Interest Rate:</span>
                    <span>{agreement.interestRate}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(agreement.dueDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span>{getStatusBadge(agreement.status)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {agreement.status === 'PENDING' && agreement.borrowerId === user.id && (
                      <>
                        <button
                          onClick={() => handleAccept(agreement.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Accept Agreement
                        </button>
                        <button
                          onClick={() => handleReject(agreement.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject Agreement
                        </button>
                      </>
                    )}
                    
                    {agreement.status === 'ACTIVE' && (
                      <button
                        onClick={() => window.location.href = `/agreement/${agreement.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Record Payment
                      </button>
                    )}
                    
                    <button
                      onClick={() => window.location.href = `/agreement/${agreement.id}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.location.href = `/agreement/${agreement.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 2-2m0 0l-2-2m6 0l-2 2m0 0l-2-2m7 2v-10a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                      </svg>
                      Verify on Blockchain
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanList;