import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Allergy {
  id: string;
  allergen: string;
  severity: {
    id: string;
    title: string | null;
  };
  reaction?: {
    id: string;
    title: string | null;
  };
  begdate: string;
  enddate?: string;
}

interface AllergyState {
  allergies: Allergy[];
  loading: boolean | null;
  error: string | null;
}

const initialState: AllergyState = {
  allergies: [], // Default as an empty array
  loading: false,
  error: null,
};

const allergySlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {
    setAllergies(state: AllergyState, action: PayloadAction<Allergy[]>) {
      state.allergies = action.payload;
    },
    setLoading(state: AllergyState) {
      state.loading = true; // When setLoading is called, set loading to true.
    },
    clearLoading(state: AllergyState) {
      state.loading = false; // You can add a `clearLoading` action to set it to false.
    },
    setError(state: AllergyState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setAllergies, setLoading, clearLoading, setError } =
  allergySlice.actions;

export default allergySlice.reducer;
