import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InsuranceData {
  id: string;
  type: string;
  provider: string;
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
  }
  relationship: string;
  validity: string;
  contact: string;
  lastVerified: string;
  deductibleRemaining: string;
  outOfPocketRemaining: string;
  status: string;
  effective_date: string;
  termination_date: string
  copays: {
    primaryCare: string;
    specialistVisit: string;
    urgentCare: string;
    emergencyRoom: string;
  };
  coverage: { name: string; covered: boolean; note?: string }[];
  insurance_company: {
    name: string;
  };
}

interface InsuranceState {
  data: InsuranceData[];
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
    setInsuranceData: (state, action: PayloadAction<InsuranceData[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setInsuranceData, setLoading, setError } = insuranceSlice.actions;
export default insuranceSlice.reducer;
