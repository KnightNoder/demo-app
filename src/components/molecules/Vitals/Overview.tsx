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

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

interface VitalData {
  id: number;
  height: number;
  weight: number;
  BMI: number;
  BMI_status: string;
  body_surface_area: number | null;
  head_circ: number;
  temperature: number;
  temp_location: string;
  respiration: number;
  inhaled_oxygen_concentration: string;
  SP02_room_air_without_oxygen: number;
  SP02_room_air_with_oxygen: number;
  POX: string;
  pulse: number;
  BP_diastolic: number;
  BP_systolic: number;
  position_of_person: string;
  pain: number | null;
  opiate_CIWAA: number | null;
  benzodiazepines_CIWA: number;
  alcohol_CIWA: number | null;
  notes: string | null;
  date: string;
  patient: Patient;
}

interface VitalsOverviewProps {
  vitalData: VitalData;
}

const VitalsOverview: React.FC<VitalsOverviewProps> = ({ vitalData }) => {
  console.log(vitalData, "vital Data");

  const vitalsData: Vital[] = [
    {
      label: "Blood Pressure",
      value: `${vitalData?.BP_systolic} / ${vitalData?.BP_diastolic} mmHg`,
      change: "0.0",
      severity:
        vitalData?.BP_systolic < 50 || vitalData?.BP_systolic > 200
          ? "CRITICAL"
          : vitalData?.BP_systolic >= 80 && vitalData?.BP_systolic <= 120
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "Heart Rate",
      value: `${vitalData?.pulse} bpm`,
      change: "+2.0",
      severity:
        vitalData?.pulse < 40 || vitalData?.pulse > 160
          ? "CRITICAL"
          : vitalData?.pulse >= 60 && vitalData?.pulse <= 80
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "Temperature",
      value: `${vitalData?.temperature} °F`,
      change: "+0.1",
      severity:
        vitalData?.temperature < 92 || vitalData?.temperature > 103
          ? "CRITICAL"
          : vitalData?.temperature >= 97 && vitalData?.temperature <= 99
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "SpO2",
      value: `${vitalData?.SP02_room_air_without_oxygen} %`,
      change: "0.0",
      severity:
        vitalData?.SP02_room_air_without_oxygen < 90
          ? "CRITICAL"
          : vitalData?.SP02_room_air_without_oxygen < 95
            ? "WARNING"
            : "NORMAL",
    },
    {
      label: "Respiratory Rate",
      value: `${vitalData?.respiration} breaths/min`,
      change: "+1.0",
      severity: "CRITICAL", // No conditions were provided, so keeping it as "CRITICAL"
    },
    {
      label: "Pain Score",
      value: `${vitalData?.pain ?? "N/A"} / 10`,
      change: "0.0",
      severity: "NORMAL",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Vitals Grid */}
      <div className="grid grid-cols-3 gap-4">
        {vitalsData.map((vital, index) => {
          const { color, bg, bar, width } = severityStyles[vital.severity];

          return (
            <div
              key={index}
              className="relative p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  {vital.label}
                </p>
                <span
                  className={`px-2 py-0.5 text-xs font-medium ${color} ${bg} rounded`}
                >
                  {vital.severity}
                </span>
              </div>
              <p className="mt-1 text-xl font-medium text-gray-900">
                {vital.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {vital.change} from last
              </p>

              {/* Severity Indicator Bar */}
              <div
                className="absolute bottom-0 left-0 h-1 rounded-b-lg"
                style={{ width: "100%" }}
              >
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
          {vitalData.SP02_room_air_without_oxygen !== null &&
          vitalData.SP02_room_air_without_oxygen < 95
            ? "SpO2 below 95% - Consider supplemental oxygen assessment"
            : "No critical alerts"}
        </div>
      </div>

      {/* Clinical Context */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Baseline Vitals</p>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">BP</span>
            <span className="font-medium">
              {vitalData.BP_systolic}/{vitalData.BP_diastolic} mmHg
            </span>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-900">
            <span className="text-gray-500">HR</span>
            <span className="font-medium">{vitalData.pulse} bpm</span>
          </div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Relevant Conditions
          </p>
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

