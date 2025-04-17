import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Insurance interface based on the API response structure
interface Insurance {
  id: number | string;
  type: string;
  plan_name: string;
  policy_number: string;
  group_number: string;
  subscriber: {
    last_name: string;
    first_name: string;
    middle_name: string;
    relationship: string;
    dob: string;
    street: string;
    postal_code: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    employer: string;
  };
  user?: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
  insurance_company: {
    name: string;
  };
  facility?: string;
  copay?: string;
  copay_notes?: string;
  effective_date: string;
  termination_date: string;
  policy_type?: string;
  deductible_amount?: string;
  deductible_met?: string;
  coinsurance?: string;
  notes?: string;

  // Fields for UI display that might need to be derived from API data
  status?: string;
  lastVerified?: string;
  deductibleRemaining?: string;
  outOfPocketRemaining?: string;
}

interface InsuranceState {
  data: Insurance[];
  loading: boolean;
  error: string | null;
}

const initialState: InsuranceState = {
  data: [],
  loading: false,
  error: null,
};

const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    fetchInsuranceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInsuranceSuccess: (state, action: PayloadAction<Insurance[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchInsuranceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchInsuranceStart,
  fetchInsuranceSuccess,
  fetchInsuranceFailure,
} = insuranceSlice.actions;

export default insuranceSlice.reducer;