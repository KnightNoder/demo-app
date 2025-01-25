import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodosUsingRest,
  toggleTodoCompletion,
} from "../../features/todo/todoThunk";
import { RootState, AppDispatch } from "../../store/store";
import AddTodo from "../AddTodo/AddTodo"; // Import AddTodo

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) =>
      state.todos as { todos: Todo[]; loading: boolean; error: string | null }
  );

  useEffect(() => {
    dispatch(fetchTodosUsingRest());
  }, [dispatch]);

  const handleToggle = (id: number) => {
    dispatch(toggleTodoCompletion(id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center ">
      <p className="text-3xl text-black">Todo List</p>
      <AddTodo /> {/* Add the form above the list */}
      <ul className="mt-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-center gap-4 mt-2 ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              className="cursor-pointer"
            />
            {todo.todo}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => dispatch(fetchTodosUsingRest())}
          className="cursor cursor-pointer px-4 py-2 bg-green-500 text-white rounded"
        >
          Get Data from REST api
        </button>
      </div>
    </div>
  );
};

export default TodoList;
