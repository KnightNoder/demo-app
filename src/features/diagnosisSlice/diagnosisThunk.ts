import { getDiagnosisDataFromApi } from "../../api/patientData";
import { AppDispatch } from "../../store/store";
import { setDiagnoses, setError, setLoading } from "./diagnosisSlice";

export const fetchDiagnosis = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const diagnosis = await getDiagnosisDataFromApi();
    dispatch(setDiagnoses(diagnosis));
  } catch (error: any) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};
