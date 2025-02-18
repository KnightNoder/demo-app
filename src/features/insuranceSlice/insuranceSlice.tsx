import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InsuranceData {
  id: string;
  type: string;
  provider: string;
  plan: string;
  policyNumber: string;
  groupNumber: string;
  subscriberId: string;
  relationship: string;
  validity: string;
  contact: string;
  lastVerified: string;
  deductibleRemaining: string;
  outOfPocketRemaining: string;
  status: string;
  copays: {
    primaryCare: string;
    specialistVisit: string;
    urgentCare: string;
    emergencyRoom: string;
  };
  coverage: { name: string; covered: boolean; note?: string }[];
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
