import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import TodoList from "./components/organisms/TodoList/TodoList";
// import Card from "./components/organisms/TodoList/Card/Card";
import "./index.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TodoList />
      {/* <Card /> */}
      {/* <Card /> */}
    </Provider>
  );
};

export default App;
