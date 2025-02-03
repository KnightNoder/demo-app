import React, { useEffect, useState } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchDiagnosis } from "../../../features/diagnosisSlice/diagnosisThunk";
import { RootState } from "../../../store/store";
import {DiagnosisTable} from "../../molecules/DiagnosisTable/DiagnosisTable";

const MedicalProblemsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { diagnosis, loading, error } = useSelector(
    (state: RootState) => state.diagnosis
  );
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    dispatch(fetchDiagnosis());
  }, [dispatch]);

  const tabs = [
    { label: "Active", count: diagnosis.length },
    { label: "Resolve" },
    { label: "All", count: diagnosis.length },
  ];

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
