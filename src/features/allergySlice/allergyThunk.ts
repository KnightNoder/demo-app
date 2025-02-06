import { AppDispatch } from "../../store/store";
import { setAllergies, setError, setLoading } from "./allergySlice";
import { getAllergyDataFromApi } from "../../api/patientData";

export const fetchAllergies = () => async (dispatch: AppDispatch) => {
  const allergens = [
    "ICD10:P07.31",
    "ICD10:P05.18",
    "ICD10:P07.03",
    "ICD10:P05.0",
  ];
  const severityLevels = [
    { id: "severe" },
    { id: "moderate" },
    { id: "moderate" },
    { id: "mild" },
  ];
  try {
    dispatch(setLoading(true));
    const allergies = await getAllergyDataFromApi();
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
