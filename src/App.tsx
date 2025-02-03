import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
// import TodoList from "./components/organisms/TodoList/TodoList";
import CardFooter from "./components/molecules/CardFooter/CardFooter";
import Card from "./components/organisms/Card/Card";
import DiagnosisCard from "./components/organisms/DiagnosisCard/DiagnosisCard";
import AllergyTable from "./components/organisms/AllergiesCard/AllergiesCard";
import "./index.css";

const App: React.FC = () => {
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
