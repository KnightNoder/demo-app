import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Provider {
  id: number;
  name: string;
}

interface Medication {
  id: number;
  patient_id: number;
  drug_display: string;
  dosage: string;
  action: string | null;
  form: string;
  route: string;
  interval: string;
  doseother: string;
  note: string;
  quantity: string;
  quantityunit: string;
  active: number;
  ndcid: string;
  refills: number;
  per_refill: number | null;
  start_date: string;
  provider: Provider;
}

interface MedicationState {
  medication: Medication | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  medication: null,
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: "medication",
  initialState,
  reducers: {
    setMedication(state, action: PayloadAction<Medication>) {
      state.medication = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});


export const { setMedication, setLoading, setError } = medicationSlice.actions;

export default medicationSlice.reducer;
