import React, { useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import CoverageDetails from "../../molecules/CoverageDetails/CoverageDetails";
import InsuranceSection from "../../molecules/InsuranceSection/InsuranceSection";

const insuranceData = [
  {
    id: '7160965258201788542',
    type: 'primary',
    provider: '100265',
    plan: 'RC-IDP',
    policyNumber: 'Test123',
    groupNumber: 'GRP123',
    subscriberId: 'SUB123',
    relationship: 'Self',
    validity: '2025-12-31',
    contact: '123-456-7890',
    lastVerified: '2024-01-01',
    deductibleRemaining: '$500',
    outOfPocketRemaining: '$1500',
    status: 'Active',
    copays: {
      primaryCare: '$20',
      specialistVisit: '$40',
      urgentCare: '$50',
      emergencyRoom: '$150'
    },
    coverage: [
      { name: 'Hospital Stay', covered: true },
      { name: 'Dental', covered: false, note: 'Not included in this plan' },
      { name: 'Prescription Drugs', covered: true }
    ]
  }
];

const InsuranceCard = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'coverage' | 'financials'>('summary');

  return (
    <div>
      <TabListHeader
        tabs={[
          { label: "summary" },
          { label: "coverage" },
          { label: "financials" }
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}  // Correct function name
      />
      {activeTab === 'summary' && <InsuranceSection insurance={insuranceData[0]} />}
      {activeTab === 'coverage' && <CoverageDetails insurance={insuranceData[0]} />}
      {activeTab === 'financials' && (
        <div>
          <h3>Financial Information</h3>
          <p>Financial details will go here...</p>
        </div>
      )}
    </div>
  );
};

export default InsuranceCard;

