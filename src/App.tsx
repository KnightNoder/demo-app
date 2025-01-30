import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
// import TodoList from "./components/organisms/TodoList/TodoList";
import AllergyTable from "./components/organisms/AllergiesCard/AllergiesCard";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import "./index.css";

const App: React.FC = () => {
  interface Allergy {
    id: string;
    type: string;
    allergen: string;
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
      allergen: "Pencillin",
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
      allergen: "Peanuts",
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
      allergen: "Pencillin",
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
      allergen: "Peanuts",
      title:
        "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
      // begdate: "2025-01-01 17:50:43",
      begdate: "2025-01-01",
      enddate: "",
      diagnosis: "ICD10:T84.81XD",
      severity: "255604002",
    },
  ];
  return (
    <Provider store={store}>
      {/* <TodoList /> */}
      <>
        {/* <Card title="Allergies" /> */}
        {/* <Card title="Diagnosis" /> */}
        <Card title="Allergies" footer={<CardFooter />}>
          <AllergyTable data={allergyData} />
        </Card>

        <Card title="Diagnosis" footer={<CardFooter />}>
          <AllergyTable data={allergyData} />
        </Card>
      </>
    </Provider>
  );
};

export default App;
