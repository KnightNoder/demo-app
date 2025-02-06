import { AppDispatch } from "../../store/store";
import { fetchTodosFromRest, fetchTodosFromGraphql } from "../../api/todosApi";
import { setLoading, setTodos, setError } from "./todoSlice";

export const fetchTodosUsingRest = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const todos = await fetchTodosFromRest();
    dispatch(setTodos(todos));
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

export const fetchTodosUsingGraphql = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const todos = await fetchTodosFromGraphql();
    dispatch(setTodos(todos));
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

export { toggleTodoCompletion } from "./todoSlice";
