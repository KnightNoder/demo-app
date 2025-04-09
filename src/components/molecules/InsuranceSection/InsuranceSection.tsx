import React from "react";
import { capitalizeWord, formatToDashDate } from "../../../utils/utils";
import Pill from "../../atoms/Pill/Pill";
import Icons from "../../../assets/Icons/Icons";

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
}

interface InsuranceSectionProps {
  insurances: Insurance[];
}

const InsuranceSection: React.FC<InsuranceSectionProps> = ({ insurances }) => {
  return (
    <div className="space-y-4">
      {insurances?.map((insurance, index) => (
        <div key={index} className="p-6 my-4 rounded-lg bg-white">
          {/* Header row with insurance name, type and status */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <h2 className="text-sm font-normal text-[#020817]">
                {insurance.insurance_company.name}
              </h2>
              <span
                className={`px-2 py-1 ml-2 text-xs rounded 
                  ${capitalizeWord(insurance.type) === "Secondary" ? "text-purple-800 bg-purple-100" : "text-blue-800 bg-blue-200"}`}
              >
                {capitalizeWord(insurance.type)}
              </span>
            </div>
            {insurance.status && (
              <Pill
                text={insurance.status}
                className="px-3 py-1 text-xs font-normal text-green-700 bg-green-100 rounded-full"
              ></Pill>
            )}
          </div>

          {/* Plan name */}
          <p className="text-xs font-light text-gray-600 mb-4">
            {insurance.plan_name}
          </p>

          {/* Two rows with policy/group and subscriber info */}
          <div className="grid grid-cols-2 gap-x-4 mb-4">
            <div className="mb-4">
              <p className="text-xs font-light text-gray-600">Policy Number</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance.policy_number}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-xs font-light text-gray-600">Group Number</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance.group_number}
              </p>
            </div>

            <div>
              <p className="text-xs font-light text-gray-600">Subscriber ID</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance.subscriber.first_name}
              </p>
            </div>
            <div>
              <p className="text-xs font-light text-gray-600">
                Relationship to Subscriber
              </p>
              <p className="text-xs font-normal text-[#020817]">
                {capitalizeWord(insurance.subscriber.relationship)}
              </p>
            </div>
          </div>

          {/* Date, phone and verification info with icons */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0">
                <Icons variant="calender" />
              </div>
              <span className="ml-2 text-xs font-light text-gray-600">
                {formatToDashDate(insurance.effective_date)} -{" "}
                {formatToDashDate(insurance.termination_date)}
              </span>
            </div>

            <div className="flex items-center mb-2">
              <div className="flex-shrink-0">
                <Icons variant="phone" />
              </div>
              <span className="ml-2 text-xs font-light text-gray-600">
                {insurance.subscriber.phone}
              </span>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icons variant="document" />
              </div>
              <span className="ml-2 text-xs font-light text-gray-600">
                Last Verified: {insurance.lastVerified}
              </span>
            </div>
          </div>

          {/* Deductible and out of pocket remaining */}
          <div>
            <div className="flex justify-between text-xs font-light text-gray-600 mb-1">
              <p>Deductible Remaining</p>
              <p>Out of Pocket Remaining</p>
            </div>

            <div className="flex justify-between gap-6">
              <div className="w-1/2">
                <div className="h-2 bg-gray-200 rounded-full mb-1">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <p className="text-xs font-normal text-[#020817]">
                  {insurance.deductibleRemaining}
                </p>
              </div>

              <div className="w-1/2">
                <div className="h-2 bg-gray-200 rounded-full mb-1">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="text-xs font-normal text-[#020817]">
                  {insurance.outOfPocketRemaining}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsuranceSection;