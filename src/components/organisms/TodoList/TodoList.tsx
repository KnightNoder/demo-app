import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodosUsingRest,
  toggleTodoCompletion,
} from "../../../features/todo/todoThunk";
import { RootState, AppDispatch } from "../../../store/store";
import AddTodo from "../../molecules/AddTodo/AddTodo";
import TodoItem from "../../molecules/TodoItem/TodoItem";
import Button from "../../atoms/Button/Button";
import { CONFIG } from "../../../constants";

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

  if (loading)
    return (
      <div className="h-[100vh] flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="h-[100vh] flex flex-col justify-center items-center">
        <p>{error}.</p>
      </div>
    );

  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-3xl text-black">Todo List</h1>
      <AddTodo />
      <ul className="mt-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo.todo}
            completed={todo.completed}
            onToggle={() => handleToggle(todo.id)}
          />
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Button
          variant="primary"
          onClick={() => dispatch(fetchTodosUsingRest())}
        >
          {CONFIG.GET_LIST}
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
