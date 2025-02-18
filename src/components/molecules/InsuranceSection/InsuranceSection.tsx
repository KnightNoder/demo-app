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
        <div key={index} className="p-4 mx-4 my-4 rounded-lg">
          <div className="flex justify-between">
            <h2 className="flex items-center text-lg font-semibold">
              {insurance.insurance_company.name} <span className="px-2 py-1 ml-2 text-xs text-blue-800 bg-blue-200 rounded ">{capitalizeWord(insurance.type)}</span>
            </h2>
            {insurance.status && <Pill text={insurance.status} className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded">
            </Pill>}
          </div>
          <p className="text-gray-600">{insurance.plan_name}</p>

          <div className="mt-2 text-sm text-gray-700">
            <div className="flex justify-between my-2">
              <div>
                <p>Policy Number: </p>
                <p className="font-semibold">{insurance.policy_number}</p>
              </div>
              <div className="mr-57">
                <p>Group Number:</p>
                <p className="font-semibold"> {insurance.group_number}</p>
              </div>
            </div>
            <div className="flex justify-between my-2">
              <div>
                <p>Subscriber ID: </p>
                <p className="font-semibold">{insurance.subscriber.first_name}</p>
              </div>
              <div className="mr-40">
                <p>Relationship to Subscriber </p>
                <p className="font-semibold">{capitalizeWord(insurance.subscriber.relationship)}</p>
              </div>
            </div>
            <div className="flex my-2">
              <Icons variant="calender" /> <span className="ml-2">{formatToDashDate(insurance.effective_date)} - {formatToDashDate(insurance.termination_date)}</span>
            </div>
            <p className="flex my-2"><Icons variant="phone" /> <span className="ml-2">{insurance.subscriber.phone}</span> </p>
            <p className="flex my-2"> <Icons variant="document" /> <span className="ml-2">Last Verified: {insurance.lastVerified}</span></p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm font-semibold">
              <p className="text-gray-700">Deductible Remaining</p>
              <p className="text-gray-700">Out of Pocket Remaining</p>
            </div>
            <div className="flex justify-between gap-2 mt-1">
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
      ))
      }
    </div>
  );
};

export default InsuranceSection;