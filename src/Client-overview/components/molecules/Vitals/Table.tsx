import React from "react";

interface VitalData {
  timestamp?: string;
  time?: string;
  date?: string;
  bp_systolic: number;
  bp_diastolic: number;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
  respiratory_rate: number;
  pain_level: number;
}

interface VitalsTableProps {
  vitalsDataArray: VitalData[];
  showAll?: boolean;
  onViewAllClick?: () => void;
}

const VitalsTable: React.FC<VitalsTableProps> = ({ vitalsDataArray }) => {
  // Format timestamp into separate time and date if needed
  const formatVitalData = (data: VitalData[]): VitalData[] => {
    return data?.map((vital) => {
      // If timestamp exists but time and date don't, extract them
      if (vital.timestamp && (!vital.time || !vital.date)) {
        const date = new Date(vital.timestamp);
        return {
          ...vital,
          time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          date: date.toLocaleDateString([], {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          }),
        };
      }
      return vital;
    });
  };

  // Process the data
  const processedData = formatVitalData(vitalsDataArray);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-200/50">
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                Time
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                BP
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                HR
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                Temp
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                SpO2
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                RR
              </th>
              <th className="text-[11px] font-light text-slate-800 py-2 px-3 text-left sticky top-0 bg-slate-50/50">
                Pain
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {processedData?.map((vital, index) => (
              <tr key={index} className="hover:bg-slate-50/50">
                <td className="py-2 px-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-light text-slate-950">
                      {vital.time || "N/A"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {vital.date || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.bp_systolic}/{vital.bp_diastolic}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.heart_rate}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.temperature}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.oxygen_saturation}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.respiratory_rate}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-xs font-light text-slate-950">
                    {vital.pain_level || "--"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VitalsTable;
