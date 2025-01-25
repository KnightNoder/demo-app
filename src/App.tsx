import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import TodoList from "./components/TodoList/TodoList";
import "./index.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

export default App;
