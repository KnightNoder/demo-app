import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchInsuranceData } from "../../../features/insuranceSlice/insuranceThunk";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import CoverageDetails from "../../molecules/CoverageDetails/CoverageDetails";
import InsuranceSection from "../../molecules/InsuranceSection/InsuranceSection";
import Financials from "../../molecules/Financials/Financials";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; 

interface InsuranceCardProps {
  patientId: string | null
}

// Create a utility function to extract financial data from insurance
const extractFinancialData = (insurances: any) => {
  // Default empty data
  const financialData = {
    deductible: {
      individual: "--",
      family: "--",
      remaining: "--"
    },
    outOfPocket: {
      individual: "--",
      family: "--",
      remaining: "--"
    }
  };

  // Make sure insurances is an array before using array methods
  if (!Array.isArray(insurances)) {
    return financialData;
  }

  // Find primary insurance if available
  const primaryInsurance = insurances.find(
    insurance => insurance?.type?.toLowerCase() === "primary"
  );

  // Extract deductible information from API data if available
  if (primaryInsurance) {
    // Set deductible data if available from API
    if (primaryInsurance.deductible_amount) {
      financialData.deductible.individual = primaryInsurance.deductible_amount;
    }
    
    // Set out-of-pocket data if available
    // Note: API might not provide this information, so we're using placeholders
    
    // For any data that's provided directly by the API, use it instead of placeholders
    if (primaryInsurance.deductible_met) {
      financialData.deductible.remaining = primaryInsurance.deductible_met;
    }
    
    if (primaryInsurance.deductibleRemaining) {
      financialData.deductible.remaining = primaryInsurance.deductibleRemaining;
    }
    
    if (primaryInsurance.outOfPocketRemaining) {
      financialData.outOfPocket.remaining = primaryInsurance.outOfPocketRemaining;
    }
  }

  return financialData;
};

const InsuranceCard: React.FC<InsuranceCardProps> = ({ patientId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: insuranceData,
    loading,
    error,
  } = useSelector((state: RootState) => state.insurance);
  const [activeTab, setActiveTab] = React.useState<
    "Summary" | "Coverage" | "Financials"
  >("Summary");

  const handleFetchInsurance = () => {
    if (patientId) {
      dispatch(fetchInsuranceData(patientId));
    }
  };

  useEffect(() => {
    handleFetchInsurance();
  }, [dispatch, patientId]);

  // Extract financial data from the insurance data
  const financialData = extractFinancialData(insuranceData);

  if (loading) {
    return (
      <div className="p-4 mx-auto bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-red-500 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Unable to Load Insurance Data
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleFetchInsurance}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={[
          { label: "Summary" },
          { label: "Coverage" },
          { label: "Financials" },
        ]}
        activeTab={activeTab}
        onTabClick={(label) =>
          setActiveTab(label as "Summary" | "Coverage" | "Financials")
        }
      />
      {Array.isArray(insuranceData) && insuranceData.length > 0 ? (
        <>
          {activeTab === "Summary" && (
            <InsuranceSection insurances={insuranceData} />
          )}
          {activeTab === "Coverage" && (
            <CoverageDetails insurances={insuranceData} />
          )}
          {activeTab === "Financials" && (
            <Financials
              deductible={financialData?.deductible}
              outOfPocket={financialData?.outOfPocket}
            />
          )}
        </>
      ) : (
        <div className="p-6 text-center bg-white rounded-lg">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-500 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            No Insurance Information
          </h3>
          <p className="text-sm text-gray-600">
            No insurance information is available for this patient.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsuranceCard;