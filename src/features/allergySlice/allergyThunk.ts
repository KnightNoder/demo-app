// import { AppDispatch } from "../../store/store";
// import { setAllergies, setError, setLoading } from "./allergySlice";
// import { getAllergyDataFromApi } from "../../api/patientData";

// // Define the thunk action
// export const fetchAllergies = () => async (dispatch: AppDispatch) => {
//   try {
//     // dispatch(setLoading(true)); // Dispatch loading before API call
//     const allergies = await getAllergyDataFromApi(); // Fetch allergies
//     dispatch(setAllergies(allergies)); // Dispatch success action
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     const errorMessage =
//       error.message || "An error occurred while fetching allergies"; // Fallback error message
//     dispatch(setError(errorMessage)); // Dispatch error action
//   } finally {
//     dispatch(setLoading(false)); // Dispatch loading false once the async operation is complete
//   }
// };
