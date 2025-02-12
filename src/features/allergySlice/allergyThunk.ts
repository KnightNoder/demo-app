import { AppDispatch } from "../../store/store";
import { setAllergies, setError, setLoading } from "./allergySlice";
import { getAllergyDataFromApi } from "../../api/patientData";

export const fetchAllergies =
  (patientId: string | null) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const allergies = await getAllergyDataFromApi(patientId);
      // if (Array.isArray(allergies.data)) {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   allergies.data.forEach((item: any, index: number) => {
      //     item.title = allergens[index];
      //     if (severityLevels[index]) {
      //       item.severity = severityLevels[index];
      //     }
      //   });
      // } else {
      //   console.error("allergies data is not an array:", allergies.data);
      // }
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
