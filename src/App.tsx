import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";
import MedicationsCard from "./components/organisms/MedicationsCard/MedicationsCard";
import ClinicalNotesCard from "./components/organisms/ClinicalNotesCard/ClinicalNotesCard";
import InsuranceCard from "./components/organisms/InsuranceCard/InsuranceCard";
// import TodoList from "./components/organisms/TodoList/TodoList";



const App: React.FC = () => {
  const [allergyTablePosition] = useState({ x: 100, y: 100 });
  const [diagnosisTablePosition] = useState({ x: 950, y: 100 });
  const [medicationsPostion] = useState({ x: 100, y: 650 });
  const [clinicalNotesPosition] = useState({ x: 950, y: 650 });
  const [insuranceCardPosition] = useState({ x: 100, y: 1250 });
  const [patientId, setpatientId] = useState<string | null>(null);

  useEffect(() => {
    const patientIdInput = document.querySelector<HTMLInputElement>('input[name="patient_id"]');
    if (patientIdInput) {
      setpatientId(patientIdInput.value);
    }
    console.log(patientIdInput?.value, 'Input from php');
  }, [])


  return (
    <Provider store={store}>
      <div className=" h-[200vh] w-[50vw] ">
        <div className=" h-[130vh] w-[50vw] ">
          {/* <TodoList /> */}
          <Card title="Allergies" initialPosition={allergyTablePosition} footer={true} category={"Allergy"} patientId={patientId}>
            <AllergyCard patientId={patientId} />
          </Card>

          <Card title="Diagnosis" initialPosition={diagnosisTablePosition} footer={true} category={"Diagnosis"} patientId={patientId}>
            <DiagnosisCard patientId={patientId} />
          </Card>

          <Card title="Medications" initialPosition={medicationsPostion} footer={true} category={"Medication"} patientId={patientId}>
            <MedicationsCard patientId={patientId} />
          </Card>

          <Card title="Clinical Notes" initialPosition={clinicalNotesPosition} footer={true} category={"Clinical Note"} patientId={patientId}>
            <ClinicalNotesCard />
          </Card>

          <Card title="Insurance Card" initialPosition={insuranceCardPosition} footer={true} category={"Insurance"} patientId={patientId}>
            <InsuranceCard patientId={patientId} />
          </Card>
        </div>
      </div>
    </Provider>
  );
};


export default App;
