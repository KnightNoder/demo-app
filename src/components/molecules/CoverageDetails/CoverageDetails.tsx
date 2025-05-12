import React from "react";
import { capitalizeWord } from "../../../utils/utils";

interface Insurance {
  id: number | string;
  type: string;
  plan_name: string;
  policy_number: string;
  group_number: string;
  subscriber: {
    last_name: string;
    first_name: string;
    middle_name: string;
    relationship: string;
    dob: string;
    street?: string;
    postal_code?: string;
    city?: string;
    state: string;
    country?: string;
    phone?: string;
    employer?: string;
  };
  user?: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  effective_date: string;
  termination_date: string;
  insurance_company: {
    name: string;
  };
  facility?: string;
  copay?: string;
  copay_notes?: string;
  policy_type?: string;
  deductible_amount?: string;
  deductible_met?: string;
  coinsurance?: string;
  notes?: string;

  // Optional fields that might be derived for UI display
  copays?: {
    primaryCare?: string;
    specialistVisit?: string;
    urgentCare?: string;
    emergencyRoom?: string;
  };
  coverage?: {
    name: string;
    covered: boolean;
    note?: string;
  }[];
}

interface CoverageDetailsProps {
  insurances: Insurance[];
}

const CoverageDetails: React.FC<CoverageDetailsProps> = ({ insurances }) => {
  // Helper function to format copay amount
  const formatCopay = (amount?: string) => {
    if (!amount) return "--";

    // If amount is already formatted as currency or has $ symbol, return as is
    if (amount.includes("$")) return amount;

    // Try to convert to number and format, otherwise return as is
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      return `$${numAmount.toFixed(2)}`;
    }
    return amount;
  };

  return (
    <div className="bg-white rounded-lg">
      {insurances.length > 0 ? (
        insurances?.map((insurance, index) => (
          <div key={index} className="p-4 mb-6">
            <h2 className="flex items-center text-sm font-normal text-[#020817]">
              {insurance?.insurance_company?.name || "--"}{" "}
              <span className="px-2 py-1 ml-2 text-xs text-blue-800 bg-blue-200 rounded">
                {capitalizeWord(insurance?.type || "--")}
              </span>
            </h2>

            {/* Display copay information */}
            <div className="mt-4">
              <h3 className="text-sm font-normal text-[#020817]">Copays</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {/* If we have detailed copays information */}
                {insurance?.copays ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-600">
                        Primary Care Visit
                      </p>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance.copays.primaryCare || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Specialist Visit</p>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance.copays.specialistVisit || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Urgent Care</p>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance.copays.urgentCare || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Emergency Room</p>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance.copays.emergencyRoom || "--"}
                      </p>
                    </div>
                  </>
                ) : (
                  // Use the general copay information if detailed copays are not available
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">General Copay</p>
                    <p className="text-xs font-normal text-[#020817]">
                      {insurance.copay ? formatCopay(insurance.copay) : "--"}
                    </p>
                    {insurance.copay_notes && (
                      <p className="text-xs font-light text-gray-600 mt-1">
                        {insurance.copay_notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Display policy details */}
            <div className="mt-4">
              <h3 className="text-sm font-normal text-[#020817]">
                Policy Details
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-600">Policy Type</p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance.policy_type || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Deductible Amount</p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance.deductible_amount || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Deductible Met</p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance.deductible_met || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Coinsurance</p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance.coinsurance || "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Display coverage details if available */}
            {insurance?.coverage && insurance.coverage.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-normal text-[#020817]">
                  Coverage Details
                </h3>
                <ul className="mt-2">
                  {insurance.coverage?.map((item, coverageIndex) => (
                    <li
                      key={coverageIndex}
                      className="flex justify-between py-2 border-b"
                    >
                      <span
                        className={`flex items-center text-xs font-light ${
                          item?.covered ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item?.covered ? "✅" : "❌"} {item?.name}
                      </span>
                      {item?.note && (
                        <span className="text-xs font-light text-gray-600">
                          {item?.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional notes */}
            {insurance.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-normal text-[#020817]">Notes</h3>
                <p className="text-xs font-light text-gray-600 mt-1">
                  {insurance.notes}
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="w-full p-4 text-center text-xs font-light text-gray-600">
          No insurance coverage found
        </div>
      )}
    </div>
  );
};

export default CoverageDetails;