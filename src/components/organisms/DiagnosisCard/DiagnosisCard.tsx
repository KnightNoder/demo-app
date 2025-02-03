import React, { useState } from "react";
import TabListHeader from "../../molecules/CardHeader/CardHeader";

interface MedicalProblem {
  id: string;
  type: string;
  title: string;
  begdate: string;
  enddate: string;
  diagnosis: string;
  user: string;
}

interface DiagnosisProps {
  data: MedicalProblem[];
}

const MedicalProblemsList: React.FC<DiagnosisProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "Active", count: data.length },
    { label: "Resolve" },
    { label: "All", count: data.length },
  ];

  return (
    <div className="p-4 mx-auto bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 mb-2 rounded-lg shadow-sm">
            <h3 className="font-medium text-md">{item.title}</h3>
            <p className="text-sm text-gray-600">Diagnosis Code: {item.diagnosis}</p>
            <p className="text-sm text-gray-600">Onset: {item.begdate}</p>
            <p className="text-sm text-gray-600">Updated by: {item.user}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalProblemsList;