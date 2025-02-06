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
  enddate: string | null | undefined;
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
    setLoading(state: AllergyState, action: PayloadAction<boolean>) {
      state.loading = action.payload; // When setLoading is called, set loading to true.
    },
    setError(state: AllergyState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setAllergies, setLoading, setError } = allergySlice.actions;

export default allergySlice.reducer;
