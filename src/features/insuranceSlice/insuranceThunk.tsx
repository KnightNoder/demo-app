
import { AppDispatch } from "../../store/store";
import { setInsuranceData, setError, setLoading } from "./insuranceSlice";
import { getInsuranceDataFromApi } from "../../api/patientData";


export const fetchInsuranceData = (patientId: string | null) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getInsuranceDataFromApi(patientId);
    dispatch(setInsuranceData(response));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(setError("Failed to load insurance data"));
    } else {
      dispatch(setError("An error occurred while fetching allergies"));
    }
  } finally {
    dispatch(setLoading(false));
  }
};