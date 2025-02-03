import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todo/todoSlice";
import allergyReducer from "../features/allergySlice/allergySlice";
import diagnosisReducer from "../features/diagnosisSlice/diagnosisSlice";

const store = configureStore({
  reducer: {
    todos: todosReducer,
    allergies: allergyReducer,
    diagnosis: diagnosisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
