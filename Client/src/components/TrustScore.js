import React from 'react';

const TrustScore = ({ score, user }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getScoreProgress = (score) => {
    return Math.min((score / 100) * 100, 100);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0v4a4 4 0 018 8m-4-4h8v8m0 0l-4-4m4 4" />
          </svg>
          <p>Please log in to view your Trust Score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⭐</span>
          Trust Score
        </h3>
      </div>

      <div className="p-6">
        {/* Score Display */}
        <div className="text-center mb-6">
          <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(score)}`}>
            <span className="text-4xl font-bold">{score}</span>
          </div>
          <div className={`mt-3 px-4 py-2 rounded-full ${getScoreColor(score)}`}>
            <span className="text-lg font-semibold">{getScoreLabel(score)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Score Progress</span>
            <span>{score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
              style={{ width: `${getScoreProgress(score)}%` }}
            />
          </div>
        </div>

        {/* Score Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold text-green-900">On-Time Payments</h4>
                <p className="text-sm text-green-700">+15 points per payment</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">📝</span>
              <div>
                <h4 className="font-semibold text-blue-900">Completed Agreements</h4>
                <p className="text-sm text-blue-700">+10 points per completion</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <h4 className="font-semibold text-yellow-900">Regular Activity</h4>
                <p className="text-sm text-yellow-700">+2 points per login</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-900">Late Payments</h4>
                <p className="text-sm text-red-700">-5 points per late payment</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <h4 className="font-semibold text-purple-900">Loan Amount</h4>
                <p className="text-sm text-purple-700">Higher amounts = more points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mt-6">
          <h4 className="font-semibold text-blue-900 mb-4">Benefits of High Trust Score</h4>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Lower interest rates from lenders</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Higher loan amounts available</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Priority in agreement matching</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Access to premium features</span>
            </li>
          </ul>
        </div>

        {/* How to Improve */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">How to Improve Your Score</h4>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="font-medium mr-2">1.</span>
              <span>Always make payments on time</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">2.</span>
              <span>Complete agreements successfully</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">3.</span>
              <span>Maintain regular activity</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">4.</span>
              <span>Build positive payment history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScore;
