import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import VitalsOverview from "../../molecules/Vitals/Overview";
import VitalsTrend from "../../molecules/Vitals/Trends";
import VitalsTable from "../../molecules/Vitals/Table";

interface VitalsCardProps {
  patientId: string | null;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ patientId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Current");

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      fetch(`https://qa-phoenix.drcloudemr.com/api/appointments/${patientId}/`)
        .then((response) => response.json())
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
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
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  const tabs = [
    { label: "Current" },
    { label: "Trends" },
    { label: "History" },
  ];

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        {activeTab === "Current" && <VitalsOverview />}
        {activeTab === "Trends" && <VitalsTrend interval={2000}/>}
        {activeTab === "History" && <VitalsTable />}
      </div>
    </div>
  );
};

export default VitalsCard;
