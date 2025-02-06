import React, { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyCard from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";
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
  return (
    <Provider store={store}>
      <>
        {/* <TodoList /> */}
        <CardWithFooter title="Allergies" initialPosition={allergyTablePosition}>
          <AllergyCard />
        </CardWithFooter>

        <CardWithFooter title="Diagnosis" initialPosition={diagnosisTablePosition}>
          <DiagnosisCard />
        </CardWithFooter>
      </>
    </Provider>
  );
};


export default App;
