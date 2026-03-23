import React, { useState } from 'react';
import { verifyAgreement } from '../services/api';
import { showSuccess, showError } from './NotificationToast';

const BlockchainVerification = ({ agreement }) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await verifyAgreement(agreement.id);
      setVerificationResult(result);
      
      if (result.verified) {
        showSuccess('Agreement verified on Hedera blockchain!');
      } else {
        showError('Agreement verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!agreement) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-4-4h8v8m0 0l-4-4m4 4" />
          </svg>
          <p>No agreement selected for verification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⛓</span>
          Blockchain Verification
        </h3>
      </div>

      <div className="p-6">
        {/* Agreement Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Agreement Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Agreement ID:</span>
              <span className="font-medium text-gray-900 ml-2">{agreement.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <span className="font-medium text-gray-900 ml-2">{formatDate(agreement.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-900 ml-2">KES {agreement.amount?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                agreement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                agreement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                agreement.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {agreement.status}
              </span>
            </div>
          </div>
        </div>

        {/* Hash Information */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-900 mb-3">Hash Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-blue-700">SHA-256 Hash:</span>
              <div className="mt-1 p-3 bg-white rounded border border-blue-200 font-mono text-sm break-all">
                {agreement.hash}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Hedera Transaction ID:</span>
              <div className="mt-1 p-3 bg-white rounded border border-blue-200 font-mono text-sm break-all">
                {agreement.hederaTxId || 'Pending...'}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {verificationResult && (
          <div className={`p-4 rounded-lg border-l-4 ${
            verificationResult.verified 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center">
              <span className={`text-2xl mr-3 ${
                verificationResult.verified ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.verified ? '✅' : '❌'}
              </span>
              <div>
                <h4 className={`font-semibold mb-1 ${
                  verificationResult.verified ? 'text-green-900' : 'text-red-900'
                }`}>
                  {verificationResult.verified ? 'Verified' : 'Verification Failed'}
                </h4>
                <p className={`text-sm ${
                  verificationResult.verified ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verificationResult.message}
                </p>
                {verificationResult.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">
                    Verified on: {formatDate(verificationResult.timestamp)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verify Button */}
        <div className="text-center">
          <button
            onClick={handleVerify}
            disabled={verifying || !agreement.hash}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying on Hedera...
              </>
            ) : (
              <>
                Verify on Hedera Blockchain
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 2-2m0 0l-2-2m6 0l-2 2m0 0l-2-2m7 2v-10a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            This verifies the agreement hash against the Hedera Consensus Service to ensure immutability.
          </p>
        </div>

        {/* Hedera Network Info */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg mt-6">
          <div className="text-center">
            <h4 className="font-semibold text-purple-900 mb-3">Hedera Network Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-purple-700">Network</div>
                <div className="text-purple-900 font-medium">Testnet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-purple-700">Speed</div>
                <div className="text-purple-900 font-medium">~3-5 seconds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-purple-700">Security</div>
                <div className="text-purple-900 font-medium">Enterprise Grade</div>
              </div>
            </div>
            <p className="text-xs text-purple-700 mt-4">
              All agreement hashes are stored on the Hedera Consensus Service for complete immutability and verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerification;
