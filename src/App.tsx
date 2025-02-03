import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
// import TodoList from "./components/organisms/TodoList/TodoList";
import AllergyTable from "./components/organisms/AllergiesCard/AllergiesCard";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import "./index.css";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";

const App: React.FC = () => {
  interface Allergy {
    id: string;
    type: string;
    title: string;
    begdate: string;
    enddate: string;
    diagnosis: string;
    reaction?: string;
    severity: string;
  }

  const allergyData: Allergy[] = [
    {
      id: "7162860202000553277",
      type: "medication",
      title: "ICD10:G30.0(Alzheimer's disease with early onset)",
      // begdate: "2025-01-01 17:49:01",
      begdate: "2025-01-01",
      // enddate: "2025-01-31 17:49:04",
      enddate: "2025-01-31",
      diagnosis: "ICD10:G30.0",
      reaction: "test Reaction",
      severity: "255604002",
    },
    {
      id: "7162860202000553295",
      type: "food",
      title:
        "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
      // begdate: "2025-01-01 17:50:43",
      begdate: "2025-01-01",
      enddate: "",
      diagnosis: "ICD10:T84.81XD",
      severity: "255604002",
    },
    {
      id: "7162860202000553277",
      type: "environmental",
      title: "ICD10:G30.0(Alzheimer's disease with early onset)",
      // begdate: "2025-01-01 17:49:01",
      begdate: "2025-01-01",
      // enddate: "2025-01-31 17:49:04",
      enddate: "2025-01-31",
      diagnosis: "ICD10:G30.0",
      reaction: "test Reaction",
      severity: "255604002",
    },
    {
      id: "7162860202000553295",
      type: "medication",
      title:
        "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
      // begdate: "2025-01-01 17:50:43",
      begdate: "2025-01-01",
      enddate: "",
      diagnosis: "ICD10:T84.81XD",
      severity: "255604002",
    },
  ];
  type MedicalProblem = {
    id: string;
    type: string;
    title: string;
    begdate: string;
    enddate: string;
    diagnosis: string;
    user: string;
  };
  
  const diagnosisData: MedicalProblem[] = [
    {
      id: "7162860202000553509",
      type: "medical_problem",
      title: "ICD10:R50.81 (Fever presenting with conditions classified elsewhere)",
      begdate: "2025-01-01 10:57:02",
      enddate: "",
      diagnosis: "ICD10:R50.81",
      user: "admin",
    },
    {
      id: "7162860202000553515",
      type: "medical_problem",
      title: "ICD10:R50.81 (Fever presenting with conditions classified elsewhere)",
      begdate: "2025-01-01",
      enddate: "",
      diagnosis: "ICD10:R50.81",
      user: "admin",
    },
  ];
  return (
    <Provider store={store}>
      {/* <TodoList /> */}
      <>
        <Card title="Allergies">
          <>
            <AllergyTable />
            <CardFooter />
          </>
        </Card>

        <Card title="Diagnosis">
          <>
            <DiagnosisCard   />
            <CardFooter />
          </>
        </Card>
      </>
    </Provider>
  );
};

export default App;
