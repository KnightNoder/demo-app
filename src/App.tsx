/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";
import MedicationsCard from "./components/organisms/MedicationsCard/MedicationsCard";
import ClinicalNotesCard from "./components/organisms/ClinicalNotesCard/ClinicalNotesCard";
// import TodoList from "./components/organisms/TodoList/TodoList";

const App: React.FC = () => {
  const [allergyTablePosition] = useState({ x: 100, y: 100 });
  const [diagnosisTablePosition] = useState({ x: 1000, y: 100 });
  const [medicationsPostion] = useState({ x: 100, y: 650 });
  const [clinicalNotesPosition] = useState({ x: 1000, y: 650 });
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
      <div className="relative mb-20 h-[130vh] w-[100vw] ">
        <div className="relative h-[100vh] w-[100vw] ">
          {/* <TodoList /> */}
          <Card title="Allergies" initialPosition={allergyTablePosition} footer={true} category={"Allergy"}>
            <AllergyCard patientId={patientId} />
          </Card>

          <Card title="Diagnosis" initialPosition={diagnosisTablePosition} footer={true} category={"Diagnosis"}>
            <DiagnosisCard patientId={patientId} />
          </Card>

          <Card title="Medications" initialPosition={medicationsPostion} footer={true} category={"Medication"}>
            <MedicationsCard />
          </Card>

          <Card title="Clinical Notes" initialPosition={clinicalNotesPosition} footer={true} category={"Clincal Note"}>
            <ClinicalNotesCard />
          </Card>
        </div>
      </div>
    </Provider>
  );
};


export default App;
