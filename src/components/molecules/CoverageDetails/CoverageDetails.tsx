import React from "react";
import { capitalizeWord } from "../../../utils/utils";

interface Insurance {
  type: string;
  provider: string;
  plan_name: string;
  policy_number: string;
  group_number: string;
  subscriber: {
    last_name: string;
    first_name: string;
    middle_name: string;
    relationship: string;
    dob: string;
    street: string;
    postal_code: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    employer: string;
  };
  relationship: string;
  validity: string;
  contact: string;
  lastVerified: string;
  deductibleRemaining: string;
  outOfPocketRemaining: string;
  status: string;
  effective_date: string;
  termination_date: string;
  insurance_company: {
    name: string;
  };
  copays: {
    primaryCare: string;
    specialistVisit: string;
    urgentCare: string;
    emergencyRoom: string;
  };
  coverage: {
    name: string;
    covered: boolean;
    note?: string;
  }[];
}

interface InsuranceSectionProps {
  insurances: Insurance[];
}

const CoverageDetails: React.FC<InsuranceSectionProps> = ({ insurances }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      {insurances.length > 0 ? (
        insurances.map((insurance, index) => (
          <div
            key={index}
            className="p-4 mb-6 border border-gray-300 rounded-lg"
          >
            <h2 className="flex items-center text-sm font-normal text-[#020817]">
              {insurance?.insurance_company?.name}{" "}
              <span className="px-2 py-1 ml-2 text-xs text-blue-800 bg-blue-200 rounded">
                {capitalizeWord(insurance?.type)}
              </span>
            </h2>

            <div className="mt-4">
              <h3 className="text-sm font-normal text-[#020817]">Copays</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs font-light text-gray-600">
                    Primary Care Visit
                  </p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance?.copays?.primaryCare}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-600">
                    Specialist Visit
                  </p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance?.copays?.specialistVisit}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-600">
                    Urgent Care
                  </p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance?.copays?.urgentCare}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-light text-gray-600">
                    Emergency Room
                  </p>
                  <p className="text-xs font-normal text-[#020817]">
                    {insurance?.copays?.emergencyRoom}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-normal text-[#020817]">
                Coverage Details
              </h3>
              <ul className="mt-2">
                {insurance?.coverage &&
                  insurance?.coverage.map((item, coverageIndex) => (
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
                        <span className="text-xs font-light text-gray-500">
                          {item?.note}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full p-4 text-center text-xs font-light text-gray-500">
          No insurance coverage found
        </div>
      )}
    </div>
  );
};

export default CoverageDetails;