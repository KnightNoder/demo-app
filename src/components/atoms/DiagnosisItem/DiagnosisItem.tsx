import React from "react";

export const DiagnosisItem: React.FC<{ item: any }> = ({ item }) => (
    <div className="p-4 mb-2 rounded-lg shadow-sm">
      <h3 className="font-medium text-md">{item.title}</h3>
      <p className="text-sm text-gray-600">Diagnosis Code: {item.diagnosis}</p>
      <p className="text-sm text-gray-600">Onset: {item.begdate}</p>
      <p className="text-sm text-gray-600">Updated by: {item.user}</p>
    </div>
  );