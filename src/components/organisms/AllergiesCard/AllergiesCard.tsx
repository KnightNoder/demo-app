import React, { useState } from "react";

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  title: string;
  begdate: string;
  enddate: string;
  diagnosis: string;
  reaction?: string;
  severity: string;
}

interface AllergyTableProps {
  data: Allergy[];
}

const AllergyTable: React.FC<AllergyTableProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredData = data.filter((allergy) => {
    if (activeTab === "All") return true;
    if (activeTab === "Medication") return allergy.type === "medication";
    return allergy.type !== "medication";
  });

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Tabs */}
      <div
        role="tablist"
        className="inline-flex h-9 items-center px-1 py-1 pl-2 w-full justify-start gap-2 bg-gray-100 rounded-sm"
      >
        {[
          { label: "All", count: data.length },
          {
            label: "Medication",
            count: data.filter((a) => a.type === "medication").length,
          },
          {
            label: "Others",
            count: data.filter((a) => a.type !== "medication").length,
          },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.label}
            className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-all rounded-sm w-full ${
              activeTab === tab.label
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ml-2 h-4 w-4">
              {tab.count}
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4">
        <div className="w-full rounded-md overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 top-0 z-10">
              <tr>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Allergen
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Type
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Severity
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Status
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Reactions
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Onset Date
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((allergy) => (
                <tr key={allergy.id} className="hover:bg-gray-50">
                  <td className="pl-1 pr-2 py-4 align-middle text-xs font-medium">
                    {allergy.allergen}
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-500 border border-gray-200 text-[10px]">
                      {allergy.type}
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      {allergy.severity}
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      Active
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="flex flex-wrap gap-1">
                      {allergy.reaction ? (
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-600 text-[10px]">
                          {allergy.reaction}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs text-gray-500">
                    {allergy.begdate}
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs text-gray-500">
                    {allergy.enddate || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllergyTable;
