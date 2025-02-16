import { AppDispatch } from "../../store/store";
import { setAllergies, setError, setLoading } from "./allergySlice";
import { getAllergyDataFromApi } from "../../api/patientData";

export const fetchAllergies =
  (patientId: string | null) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const allergies = await getAllergyDataFromApi(patientId);
      dispatch(setAllergies(allergies.data));
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError("An error occurred while fetching allergies"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
