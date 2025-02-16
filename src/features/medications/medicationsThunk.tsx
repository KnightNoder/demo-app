import { AppDispatch } from "../../store/store";
import { setMedications, setError, setLoading } from "./medicationsSlice";
import { getMedicationsDataFromApi } from "../../api/patientData";

export const fetchMedications =
  (patientId: string | null) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const medications = await getMedicationsDataFromApi(patientId);
      dispatch(setMedications(medications.data));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError("An error occurred while fetching medications"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
