import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../../../features/todo/todoSlice";
import Input from "../../atoms/Inputs/TextInput/Input";
import Button from "../../atoms/Button/Button";

const AddTodo: React.FC = () => {
  const [task, setTask] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      dispatch(addTodo(task));
      setTask("");
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task"
        variant="outlined"
      />
      <Button type="submit" variant="primary" onClick={handleSubmit}>
        Add
      </Button>
    </div>
  );
};

export default AddTodo;
