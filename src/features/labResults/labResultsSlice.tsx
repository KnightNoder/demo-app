import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the LabReport interface
interface LabReport {
  id: string;
  test: string;
  result: string;
  range: string;
  status: "normal" | "abnormal" | "critical";
  ordered: string;
  reported: string;
}

// Define the initial state for the lab reports
interface LabReportState {
  labReports: LabReport[];
  loading: boolean;
  error: string | null;
}

// Initial state for the lab reports
const initialState: LabReportState = {
  labReports: [],
  loading: false,
  error: null,
};

// Lab report slice
const labReportSlice = createSlice({
  name: "labReports",
  initialState,
  reducers: {
    setLabReports(state: LabReportState, action: PayloadAction<LabReport[]>) {
      state.labReports = action.payload;
    },
    setLoading(state: LabReportState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state: LabReportState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    processLabReports(state: LabReportState, action: PayloadAction<any>) {
      const data = action.payload;
      const labReports = data.procedure_reports.flatMap((report: any) =>
        report.procedure_results.map((result: any) => ({
          id: result.id.toString(), // Ensure ID is a string
          test: result.result_text,
          result: result.result,
          range: result.range,
          status:
            result.result === "NORMAL"
              ? "normal"
              : result.result === "NEGATIVE"
                ? "abnormal"
                : "critical",
          ordered: report.date_ordered,
          reported: report.date_report,
        }))
      );
      state.labReports = labReports;
    },
  },
});

// Export actions
export const { setLabReports, setLoading, setError, processLabReports } =
  labReportSlice.actions;

export default labReportSlice.reducer;
