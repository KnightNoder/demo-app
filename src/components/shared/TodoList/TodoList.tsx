import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodosUsingRest,
  toggleTodoCompletion,
} from "../../../features/todo/todoThunk";
import { RootState, AppDispatch } from "../../../store/store";
import AddTodo from "../../shared/AddTodo/AddTodo";
import TodoItem from "../../shared/TodoItem/TodoItem";
import Button from "../../base/Button/Button";

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
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <p className="text-3xl text-black">Todo List</p>
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
          Get Data from REST API
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
