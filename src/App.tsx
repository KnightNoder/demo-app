import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyTable from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";

const CardWithFooter: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <Card title={title}>
    {children}
    <CardFooter />
  </Card>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <>
        <CardWithFooter title="Allergies">
          <AllergyTable />
        </CardWithFooter>

        <CardWithFooter title="Diagnosis">
          <DiagnosisCard />
        </CardWithFooter>
      </>
    </Provider>
  );
};

export default App;
