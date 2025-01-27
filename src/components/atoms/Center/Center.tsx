import React from "react";

interface CenterProps {
  children: React.ReactNode;
}

const Center: React.FC<CenterProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-[100vh]">{children}</div>
  );
};

export default Center;
