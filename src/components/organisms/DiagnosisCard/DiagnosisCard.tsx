import React, { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { DiagnosisTable } from "../../molecules/DiagnosisTable/DiagnosisTable";

const MedicalProblemsList: React.FC = () => {
  // State to store diagnosis data, loading state, and error state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [diagnosis, setDiagnosis] = useState<any[]>([]); // Use 'any' type for simplicity, you can define a proper type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");

  // Tabs data
  const tabs = [
    { label: "Active", count: diagnosis.filter(d => d.status === 'Active').length }, // Filter based on status for active count
    { label: "Resolved", count: diagnosis.filter(d => d.status === 'Resolved').length }, // Filter based on status for resolved count
    { label: "All", count: diagnosis.length },
  ];

  // Fetch diagnosis data from API
  useEffect(() => {
    const fetchDiagnosisData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "http://qa-phoenix.drcloudemr.com/drcloud_1/public/api/allergies/1004785/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch diagnosis data");
        }

        const data = await response.json();
        setDiagnosis(data.data.splice(0, 2)); // Assuming the response structure is like { data: [...] }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching diagnosis data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisData();
  }, []);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 mx-auto bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        <DiagnosisTable diagnosis={diagnosis} />
      </div>
    </div>
  );
};

export default MedicalProblemsList;
