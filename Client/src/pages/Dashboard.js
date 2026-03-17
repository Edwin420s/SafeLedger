import React from 'react';
import AgreementForm from '../components/AgreementForm';
import LoanList from '../components/LoanList';

const Dashboard = () => {
  const handleAgreementCreated = (newAgreement) => {
    // Optionally refresh the list – LoanList will re-fetch on mount, but we could pass a refetch prop.
    // For simplicity, we'll just rely on LoanList's internal useEffect.
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <AgreementForm onAgreementCreated={handleAgreementCreated} />
      <LoanList />
    </div>
  );
};

export default Dashboard;