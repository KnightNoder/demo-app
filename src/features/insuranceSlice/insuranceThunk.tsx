import {
  fetchInsuranceStart,
  fetchInsuranceSuccess,
  fetchInsuranceFailure,
} from "./insuranceSlice";
import axiosClient from "../../api/axiosClient";

// Thunk to fetch insurance data for a specific patient
export const fetchInsuranceData = (patientId: string) => async (dispatch: any) => {
  try {
    dispatch(fetchInsuranceStart());

    // Replace with your actual API endpoint
    const response = await axiosClient.get(`/insurance-data?pid=${patientId}`);

    // Assuming the API returns the insurance data in the format we need
    dispatch(fetchInsuranceSuccess(response.data));
  } catch (error) {
    let errorMessage = "Failed to fetch insurance data";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    dispatch(fetchInsuranceFailure(errorMessage));
  }
};
