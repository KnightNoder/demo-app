import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todo/todoSlice";
import allergyReducer from "../features/allergySlice/allergySlice";
import diagnosisReducer from "../features/diagnosisSlice/diagnosisSlice";
import medicationsReducer from "../features/medications/medicationsSlice";
import insuranceReducer from "../features/insuranceSlice/insuranceSlice";
import labReportsReducer from "../features/labResults/labResultsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    todos: todosReducer,
    allergies: allergyReducer,
    diagnosis: diagnosisReducer,
    medications: medicationsReducer,
    insurance: insuranceReducer,
    labReports: labReportsReducer,
  },
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
