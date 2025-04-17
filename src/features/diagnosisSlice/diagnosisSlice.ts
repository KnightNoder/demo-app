import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DiagnosisUser {
  id: number;
  username: string;
  fname: string;
  mname: string;
  lname: string;
}

interface Diagnosis {
  id: number;
  title: string;
  begdate: string;
  enddate?: string; // Making this optional since it wasn't in your example
  outcome: number;
  diagnosis: string;
  primary_diagnosis_code: number;
  modified_by: string;
  modified_on: string;
  user: DiagnosisUser;
}

interface DiagnosisState {
  diagnosis: Diagnosis[];
  loading: boolean;
  error: null | string;
}

const initialState: DiagnosisState = {
  diagnosis: [],
  loading: false,
  error: null,
};

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    setDiagnoses: (state, action: PayloadAction<Diagnosis[]>) => {
      state.diagnosis = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<null | string>) => {
      state.error = action.payload;
    },
    addDiagnosis: (state, action: PayloadAction<Diagnosis>) => {
      state.diagnosis.push(action.payload);
    },
    updateDiagnosis: (state, action: PayloadAction<Diagnosis>) => {
      const index = state.diagnosis.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.diagnosis[index] = action.payload;
      }
    },
    deleteDiagnosis: (state, action: PayloadAction<number>) => {
      state.diagnosis = state.diagnosis.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setDiagnoses,
  setError,
  setLoading,
  addDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
} = diagnosisSlice.actions;

export default diagnosisSlice.reducer;