import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Diagnosis {
  id: string;
  type: string;
  title: string;
  begdate: string;
  enddate: string;
  diagnosis: string;
  user: string;
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
  },
});

export const { setDiagnoses, setError, setLoading, addDiagnosis } =
  diagnosisSlice.actions;

export default diagnosisSlice.reducer;
