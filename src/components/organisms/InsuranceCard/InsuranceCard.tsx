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

const InsuranceCard: React.FC<InsuranceCardProps> = ({ patientId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: insuranceData, loading, error } = useSelector((state: RootState) => state.insurance);
  const [activeTab, setActiveTab] = React.useState<"Summary" | "Coverage" | "Financials">("Summary");

  useEffect(() => {
    if (patientId) {
      dispatch(fetchInsuranceData(patientId));
    }
  }, [dispatch, patientId]);

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
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!insuranceData.length) {
    return <div className="text-gray-500">No insurance data available.</div>;
  }

  return (
    <div className="mx-4">
      <TabListHeader
        tabs={[
          { label: "Summary" },
          { label: "Coverage" },
          { label: "Financials" }
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}  
      />
      {activeTab === "Summary" && <InsuranceSection insurances={insuranceData} />}
      {activeTab === "Coverage" && <CoverageDetails insurances={insuranceData} />}
      {activeTab === "Financials" && (
        <Financials
          deductible={{
            individual: 2000,
            family: 4000,
            remaining: 1500
          }}
          outOfPocket={{
            individual: 5000,
            family: 10000,
            remaining: 4000
          }}
        />
      )}
    </div>
  );
};

export default InsuranceCard;
