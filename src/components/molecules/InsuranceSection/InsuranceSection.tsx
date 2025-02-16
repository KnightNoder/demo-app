import React from "react";

interface Insurance {
  type: string;
  provider: string;
  plan: string;
  policyNumber: string;
  groupNumber: string;
  subscriberId: string;
  relationship: string;
  validity: string;
  contact: string;
  lastVerified: string;
  deductibleRemaining: string;
  outOfPocketRemaining: string;
  status: string;
}

interface InsuranceSectionProps {
  insurance: Insurance;
}

const InsuranceSection: React.FC<InsuranceSectionProps> = ({ insurance }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">
          {insurance.provider} <span className="text-sm text-blue-500">{insurance.type}</span>
        </h2>
        <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded">
          {insurance.status}
        </span>
      </div>
      <p className="text-gray-600">{insurance.plan}</p>

      <div className="mt-2 text-sm text-gray-700">
        <p>
          <strong>Policy Number:</strong> {insurance.policyNumber}
        </p>
        <p>
          <strong>Group Number:</strong> {insurance.groupNumber}
        </p>
        <p>
          <strong>Subscriber ID:</strong> {insurance.subscriberId}
        </p>
        <p>
          <strong>Relationship:</strong> {insurance.relationship}
        </p>
        <p>
          <strong>Validity:</strong> {insurance.validity}
        </p>
        <p>
          <strong>Contact:</strong> {insurance.contact}
        </p>
        <p>
          <strong>Last Verified:</strong> {insurance.lastVerified}
        </p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm font-semibold">
          <p className="text-gray-700">Deductible Remaining</p>
          <p className="text-gray-700">Out of Pocket Remaining</p>
        </div>
        <div className="flex justify-between mt-1">
          <div className="w-1/2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: "50%" }}></div>
            </div>
            <p className="text-sm text-gray-700">{insurance.deductibleRemaining}</p>
          </div>
          <div className="w-1/2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <p className="text-sm text-gray-700">{insurance.outOfPocketRemaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSection;
