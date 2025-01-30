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
    console.log(allergy.id, "allergy data");
    if (activeTab === "All") return true;
    if (activeTab === "Medication") return allergy.type === "medication";
    return allergy.type !== "medication";
  });

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Tabs */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="new-tabs inline-flex h-9 items-center/80 px-1 py-1 pl-2 shrink-0 w-full justify-start gap-2 bg-gray-100"
        data-orientation="horizontal"
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
            aria-controls={`radix-:r5g:-content-${tab.label.toLowerCase()}`}
            data-state={activeTab === tab.label ? "active" : "inactive"}
            id={`radix-:r5g:-trigger-${tab.label.toLowerCase()}`}
            className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-xs font-medium text-zinc-500 transition-all hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] rounded-sm w-full"
            data-orientation="horizontal"
            data-radix-collection-item=""
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#F4F4F5]! focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  text-gray-600 hover ml-2 h-4 w-4">
              {tab.count}
            </div>
          </button>
        ))}
      </div>

      <div>
        <div className="h-full w-full rounded-[inherit] overflow-x-hidden ">
          <div className="min-width: 100%; display: table;">
            <div className="pl-2 pr-4 pt-2">
              <div className="relative w-full overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#F8FAFC]/50 sticky top-0 z-10 ">
                    <tr className="bg-[#F8FAFC]! hover:bg-[#F8FAFC]/50">
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Allergen
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Type
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Severity
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Status
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Reactions
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Onset Date
                      </th>
                      <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-[#A0A0C8] tracking-wide uppercase align-middle whitespace-nowrap">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-[#F8FAFC]/30">
                    {filteredData.map((allergy) => (
                      <tr
                        key={allergy.id}
                        className-="bg-[#F4F4F5]! hover:bg-[#F8FAFC]/50"
                      >
                        <td className="pl-1 pr-2 py-4 align-middle text-xs font-medium">
                          {allergy.allergen}
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs">
                          <div className="inline-flex items-center  justify-center rounded-full px-2.5 py-0.5 font-medium bg-[#F4F4F5]! focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-500 border border-gray-200 hover: text-[10px]">
                            {allergy.type}
                          </div>
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-[#F4F4F5]! focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-700 hover:bg-gray-200 text-[10px]">
                            {allergy.severity}
                          </div>
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-[#F4F4F5]! focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-700 hover:bg-gray-200 text-[10px]">
                            Active
                          </div>
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs">
                          <div className="flex flex-wrap gap-1">
                            {allergy.reaction ? (
                              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-[#F4F4F5]! focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  text-gray-600 hover text-[10px]">
                                {allergy.reaction}
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs text-[#A0A0C8]">
                          {allergy.begdate}
                        </td>
                        <td className="pl-1 pr-2 py-1 align-middle text-xs text-[#A0A0C8]">
                          {allergy.enddate || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllergyTable;
