import React from "react";
import Checkbox from "../../atoms/Checkbox/Checkbox";

interface TodoItemProps {
  todo: string;
  completed: boolean;
  onToggle: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, completed, onToggle }) => {
  return (
    <li
      className={`flex items-start justify-start gap-4 mt-2 ${
        completed ? "line-through text-gray-500" : ""
      }`}
    >
      <Checkbox checked={completed} onChange={onToggle} />
      {todo}
    </li>
  );
};

export default TodoItem;
