import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  severity: string;
  reaction?: string;
  begdate: string;
  enddate?: string;
}

interface AllergyState {
  allergies: Allergy[];
  loading: boolean;
  error: string | null;
}

const initialState: AllergyState = {
  allergies: [],
  loading: false,
  error: null,
};

const allergySlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {
    setAllergies: (state, action: PayloadAction<Allergy[]>) => {
      state.allergies = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addAllergy: (state, action: PayloadAction<Allergy>) => {
      state.allergies.push(action.payload);
    },
  },
});

export const { setAllergies, setLoading, setError, addAllergy } =
  allergySlice.actions;
export default allergySlice.reducer;
