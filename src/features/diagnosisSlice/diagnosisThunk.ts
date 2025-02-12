import { getDiagnosisDataFromApi } from "../../api/patientData";
import { AppDispatch } from "../../store/store";
import { setDiagnoses, setError, setLoading } from "./diagnosisSlice";

export const fetchDiagnosis =
  (patientId: string | null) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const diagnosis = await getDiagnosisDataFromApi(patientId);
      console.log(diagnosis.data, "diag data");
      dispatch(setDiagnoses(diagnosis));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError("An unknown error occurred"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

