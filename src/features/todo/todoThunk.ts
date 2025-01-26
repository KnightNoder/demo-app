import { AppDispatch } from "../../store/store";
import { fetchTodosFromRest, fetchTodosFromGraphql } from "../../api/todosApi";
import { setLoading, setTodos, setError } from "./todoSlice";

export const fetchTodosUsingRest = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const todos = await fetchTodosFromRest();
    dispatch(setTodos(todos));
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export const fetchTodosUsingGraphql = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const todos = await fetchTodosFromGraphql();
    dispatch(setTodos(todos));
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export { toggleTodoCompletion } from "./todoSlice";
