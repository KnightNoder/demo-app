import React, { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyTable from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";

const CardWithFooter: React.FC<{ title: string; children: ReactNode; position: { x: number, y: number } }> = ({ title, children, position }) => (
  <Card title={title} initialPosition={position}>
    {children}
    <CardFooter />
  </Card>
);

const App: React.FC = () => {
  const [allergyTablePosition] = useState({ x: 100, y: 100 });
  const [diagnosisTablePosition] = useState({ x: 850, y: 100 });
  return (
    <Provider store={store}>
      <>
        <CardWithFooter title="Allergies" position={allergyTablePosition} >
          <AllergyTable />
        </CardWithFooter>

        <CardWithFooter title="Diagnosis" position={diagnosisTablePosition}>
          <DiagnosisCard />
        </CardWithFooter>
      </>
    </Provider>
  );
};

export default App;
