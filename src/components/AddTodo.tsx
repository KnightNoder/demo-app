import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../features/todo/todoSlice"; // Import the action

const AddTodo: React.FC = () => {
  const [task, setTask] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      dispatch(addTodo(task)); // Dispatch the addTodo action
      setTask(""); // Clear the input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task"
        className="px-2 py-1 border rounded"
      />
      <button
        type="submit"
        className="cursor-pointer px-3 py-1 bg-blue-500! text-white rounded"
      >
        Add
      </button>
    </form>
  );
};

export default AddTodo;
