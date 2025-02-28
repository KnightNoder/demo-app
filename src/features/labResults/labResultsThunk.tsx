import { getLabResultsDataFromApi } from "../../api/patientData";
import { AppDispatch } from "../../store/store";
import { setLoading, setError, processLabReports } from "./labResultsSlice";

export const fetchLabReports = (patientId: string | null) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await getLabResultsDataFromApi(patientId);
      dispatch(processLabReports(data));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError("Failed to fetch or process lab reports"));
      dispatch(setLoading(false));
    }
  };
};
