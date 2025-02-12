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

const CardWithFooter: React.FC<{
  title: string;
  children: ReactNode;
  initialPosition: { x: number; y: number }
}> = ({ title, children, initialPosition }) => (
  <Card title={title} initialPosition={initialPosition}>
    {children}
    <CardFooter />
  </Card>
);



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
      <div className="mb-20">
        {/* <TodoList /> */}
        <CardWithFooter title="Allergies" initialPosition={allergyTablePosition}>
          <AllergyCard patientId={patientId} />
        </CardWithFooter>

        <CardWithFooter title="Diagnosis" initialPosition={diagnosisTablePosition}>
          <DiagnosisCard patientId={patientId} />
        </CardWithFooter>

        <CardWithFooter title="Medications" initialPosition={medicationsPostion}>
          <MedicationsCard />
        </CardWithFooter>

        <CardWithFooter title="Clinical Notes" initialPosition={clinicalNotesPosition}>
          <ClinicalNotesCard />
        </CardWithFooter>
      </div>
    </Provider>
  );
};


export default App;
