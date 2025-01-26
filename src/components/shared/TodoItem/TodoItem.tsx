import React from "react";
import Checkbox from "../../base/Checkbox/Checkbox";

interface TodoItemProps {
  todo: string;
  completed: boolean;
  onToggle: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, completed, onToggle }) => {
  return (
    <li
      className={`flex items-center justify-center gap-4 mt-2 ${
        completed ? "line-through text-gray-500" : ""
      }`}
    >
      <Checkbox checked={completed} onChange={onToggle} />
      {todo}
    </li>
  );
};

export default TodoItem;
