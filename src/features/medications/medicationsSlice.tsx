import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Medication {
  title: string;
  quantity: string;
  route: string;
  frequency: string;
  ordered_by: string;
  begdate: string;
  refillsRemaining: number;
  dosage: string;
  interval: string;
  isActive: boolean;
}

interface MedicationState {
  medications: Medication[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  medications: [],
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    setMedications(state, action: PayloadAction<Medication[]>) {
      state.medications = action.payload;
    },
    addMedication(state, action: PayloadAction<Medication>) {
      state.medications.push(action.payload);
    },
    updateMedication(state, action: PayloadAction<Medication>) {
      const index = state.medications.findIndex(
        (med) => med.title === action.payload.title
      );
      if (index !== -1) {
        state.medications[index] = action.payload;
      }
    },
    removeMedication(state, action: PayloadAction<string>) {
      state.medications = state.medications.filter(
        (med) => med.title !== action.payload
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setMedications,
  addMedication,
  updateMedication,
  removeMedication,
  setLoading,
  setError,
} = medicationSlice.actions;

export default medicationSlice.reducer;
