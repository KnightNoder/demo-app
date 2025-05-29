import React from "react";
import { capitalizeWord, formatToDashDate } from "../../../../utils/utils";
import Icons from "../../../assets/Icons/Icons";

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
    street: string;
    postal_code: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    employer: string;
  };
  insurance_company: {
    name: string;
  };
  effective_date: string;
  termination_date: string;
  status?: string;
  lastVerified?: string;
  deductibleRemaining?: string;
  outOfPocketRemaining?: string;
}

interface InsuranceSectionProps {
  insurances: Insurance[];
}

const InsuranceSection: React.FC<InsuranceSectionProps> = ({ insurances }) => {
  // Helper function to determine type badge styling
  const getTypeBadgeStyles = (type: string) => {
    switch (capitalizeWord(type)) {
      case "Primary":
        return "bg-blue-100 text-blue-800";
      case "Secondary":
        return "bg-purple-100 text-purple-800";
      case "Tertiary":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to determine status badge styling
  const getStatusBadgeStyles = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to calculate progress bar percentage
  const calculateProgressWidth = (value?: string) => {
    if (!value) return "0%";

    // Extract number from string (assuming format like "$1,500.00")
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numValue)) return "0%";

    // Arbitrary calculation for demonstration
    // In real application, this would be based on actual deductible/out-of-pocket max values
    return `${Math.round((numValue / 5000) * 100)}%`;
  };

  // Format phone number or return placeholder
  const formatPhone = (phone?: string) => {
    return phone || "--";
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {insurances?.map((insurance, index) => (
        <div key={index} className="bg-white rounded-lg p-6 space-y-4">
          {/* Header with insurance name, type and status */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 mb-0">
                <h3 className="text-sm font-normal text-[#020817]">
                  {insurance?.insurance_company?.name || "--"}
                </h3>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadgeStyles(insurance?.type || "")}`}
                >
                  {capitalizeWord(insurance?.type || "--")}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {insurance?.plan_name || "--"}
              </p>
            </div>
            {insurance?.status && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeStyles(insurance?.status)}`}
              >
                {insurance?.status}
              </span>
            )}
          </div>

          {/* Policy, group, subscriber information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Policy Number</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance?.policy_number || "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Group Number</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance?.group_number || "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Subscriber</p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance?.subscriber
                  ? `${insurance?.subscriber.first_name || ""} ${insurance?.subscriber.middle_name || ""} ${insurance?.subscriber.last_name || ""}`.trim() ||
                    "--"
                  : "--"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                Relationship to Subscriber
              </p>
              <p className="text-xs font-normal text-[#020817]">
                {insurance?.subscriber?.relationship
                  ? capitalizeWord(insurance?.subscriber.relationship)
                  : "--"}
              </p>
            </div>
          </div>

          {/* Date, phone, verification information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Icons variant="calender" />
              <span>
                {formatToDashDate(insurance?.effective_date) || "--"} -{" "}
                {formatToDashDate(insurance?.termination_date) || "--"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Icons variant="phone" />
              <span>{formatPhone(insurance?.subscriber?.phone) || "N/A"}</span>
            </div>
            {
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Icons variant="document" />
                <span>Last Verified: {insurance?.lastVerified || "--"}</span>
              </div>
            }
          </div>

          {/* Deductible and out of pocket details */}
          {(insurance?.deductibleRemaining ||
            insurance?.outOfPocketRemaining) && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                {insurance?.deductibleRemaining && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Deductible Remaining
                    </p>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: calculateProgressWidth(
                              insurance?.deductibleRemaining
                            ),
                          }}
                        ></div>
                      </div>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance?.deductibleRemaining}
                      </p>
                    </div>
                  </div>
                )}

                {insurance?.outOfPocketRemaining && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Out of Pocket Remaining
                    </p>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: calculateProgressWidth(
                              insurance?.outOfPocketRemaining
                            ),
                          }}
                        ></div>
                      </div>
                      <p className="text-xs font-normal text-[#020817]">
                        {insurance?.outOfPocketRemaining}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InsuranceSection;