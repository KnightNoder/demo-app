import React from "react";

interface CommonCardProps {
  children: React.ReactNode;
}

const CommonCard: React.FC<CommonCardProps> = ({ children }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl">
      {children}
    </div>
  );
};

export default CommonCard;
