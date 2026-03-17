import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgreementById, verifyAgreement } from '../services/api';
import { showError, showSuccess } from '../components/NotificationToast';

const Agreement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAgreement();
    } else {
      navigate('/dashboard');
    }
  }, [id]);

  const fetchAgreement = async () => {
    try {
      const data = await getAgreementById(id);
      setAgreement(data);
    } catch (err) {
      showError('Agreement not found.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await verifyAgreement(id);
      setVerificationResult(result);
      if (result.valid) {
        showSuccess('Agreement verified on Hedera!');
      } else {
        showError('Verification failed: data mismatch.');
      }
    } catch (err) {
      showError('Verification error.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading agreement...</div>;
  if (!agreement) return <div className="text-center py-4">Agreement not found.</div>;

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Loan Agreement Details</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Borrower</p>
          <p className="font-semibold">{agreement.borrowerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-semibold">KES {agreement.amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Due Date</p>
          <p className="font-semibold">{new Date(agreement.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Terms</p>
          <p className="whitespace-pre-wrap">{agreement.terms}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-semibold capitalize">{agreement.status}</p>
        </div>
        {agreement.hederaTxId && (
          <div>
            <p className="text-sm text-gray-600">Hedera Transaction ID</p>
            <p className="font-mono text-xs break-all">{agreement.hederaTxId}</p>
          </div>
        )}
        <div className="pt-4">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify on Hedera'}
          </button>
        </div>
        {verificationResult && (
          <div className={`mt-4 p-4 rounded ${verificationResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold">{verificationResult.valid ? '✅ Verified' : '❌ Verification Failed'}</p>
            <p className="text-sm mt-1">Hash: {verificationResult.hash}</p>
            <p className="text-sm">Timestamp: {verificationResult.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agreement;