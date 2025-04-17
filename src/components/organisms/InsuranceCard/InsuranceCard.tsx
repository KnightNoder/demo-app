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

  useEffect(() => {
    if (patientId) {
      dispatch(fetchInsuranceData(patientId));
    }
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
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="flex flex-col items-center mb-4">
          <Skeleton circle height={40} width={40} />
          <div className="mt-4">
            <Skeleton height={30} width={200} />
          </div>
          <div className="mt-2">
            <Skeleton height={20} width={250} />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-normal text-[#020817]">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-xs font-light text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  return (
    <div className="">
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
      {Array.isArray([]) && insuranceData.length > 0 ? (
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
        <div className="w-full p-4 text-center text-xs font-light text-gray-600">
          No Insurances found
        </div>
      )}
    </div>
  );
};

export default InsuranceCard;