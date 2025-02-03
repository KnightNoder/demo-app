import { getAllergyDataFromApi } from "../../api/patientData";
import { AppDispatch } from "../../store/store";
import { setAllergies, setError, setLoading } from "./allergySlice";

export const fetchAllergies = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const allergies = await getAllergyDataFromApi();
    dispatch(setAllergies(allergies));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
