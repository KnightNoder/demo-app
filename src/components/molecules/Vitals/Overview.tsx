type Severity = "NORMAL" | "WARNING" | "CRITICAL";

const severityStyles: Record<Severity, { color: string; bg: string; bar: string; width: string }> = {
  NORMAL: { color: "text-green-600", bg: "bg-green-100", bar: "bg-green-500", width: "w-1/4" },
  WARNING: { color: "text-orange-600", bg: "bg-orange-100", bar: "bg-orange-500", width: "w-1/2" },
  CRITICAL: { color: "text-red-600", bg: "bg-red-100", bar: "bg-red-500", width: "w-full" },
};

// Define type for vitals data
interface Vital {
  label: string;
  value: string;
  change: string;
  severity: Severity;
}

const vitalsData: Vital[] = [
  { label: "Blood Pressure", value: "138.3 / 55.1 mmHg", change: "0.0", severity: "WARNING" },
  { label: "Heart Rate", value: "89.1 bpm", change: "+2.0", severity: "NORMAL" },
  { label: "Temperature", value: "93.7 °F", change: "+0.1", severity: "CRITICAL" },
  { label: "SpO2", value: "82.3 %", change: "0.0", severity: "CRITICAL" },
  { label: "Respiratory Rate", value: "29.7 breaths/min", change: "+1.0", severity: "CRITICAL" },
  { label: "Pain Score", value: "2.0 /10", change: "0.0", severity: "NORMAL" },
];
const VitalsOverview = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Vitals Grid */}
      <div className="grid grid-cols-3 gap-4">
      {vitalsData.map((vital, index) => {
        const { color, bg, bar, width } = severityStyles[vital.severity];

        return (
          <div key={index} className="relative p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 uppercase">{vital.label}</p>
              <span className={`px-2 py-0.5 text-xs font-medium ${color} ${bg} rounded`}>
                {vital.severity}
              </span>
            </div>
            <p className="mt-1 text-xl font-medium text-gray-900">{vital.value}</p>
            <p className="mt-1 text-sm text-gray-500">{vital.change} from last</p>

            {/* Severity Indicator Bar */}
            <div className="absolute bottom-0 left-0 h-1 rounded-b-lg" style={{ width: "100%" }}>
              <div className={`h-full ${bar} ${width} rounded-b-lg`} />
            </div>
          </div>
        );
      })}
      </div>

      {/* Critical Alerts */}
      <div className="p-4 mt-6 bg-gray-100 border border-gray-300 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Critical Alerts</p>
        <div className="flex items-center mt-2 text-sm text-gray-800">
          <span className="inline-block w-3 h-3 mr-2 bg-red-600 rounded-full"></span>
          SpO2 below 95% - Consider supplemental oxygen assessment
        </div>
      </div>

      {/* Clinical Context */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Baseline Vitals</p>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">BP</span>
            <span className="font-medium">118/78 mmHg</span>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">HR</span>
            <span className="font-medium">68 bpm</span>
          </div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Relevant Conditions</p>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">HTN</span>
            <span className="font-medium">Active</span>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">DM Type 2</span>
            <span className="font-medium">Well-controlled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsOverview;
