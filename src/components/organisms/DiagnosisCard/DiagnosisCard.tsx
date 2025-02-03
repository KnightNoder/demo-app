import React, { useEffect, useState } from "react";
import TabListHeader from "../../molecules/CardHeader/CardHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchDiagnosis } from "../../../features/diagnosisSlice/diagnosisThunk";
import { RootState } from "../../../store/store";


const MedicalProblemsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {diagnosis,loading,error} = useSelector((state: RootState) => state.diagnosis)
  const [activeTab, setActiveTab] = useState("All");

  useEffect(()=>{
    dispatch(fetchDiagnosis())
  },[dispatch])

  const tabs = [
    { label: "Active", count: diagnosis.length },
    { label: "Resolve" },
    { label: "All", count: diagnosis.length },
  ];

  return (
    <div className="p-4 mx-auto bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        {diagnosis.map((item) => (
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