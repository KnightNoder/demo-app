import React from "react";

type Severity = "NORMAL" | "WARNING" | "CRITICAL";

const severityStyles: Record<
  Severity,
  { color: string; bg: string; bar: string; width: string }
> = {
  NORMAL: {
    color: "text-green-600",
    bg: "bg-green-100",
    bar: "bg-green-500",
    width: "w-1/4",
  },
  WARNING: {
    color: "text-orange-600",
    bg: "bg-orange-100",
    bar: "bg-orange-500",
    width: "w-1/2",
  },
  CRITICAL: {
    color: "text-red-600",
    bg: "bg-red-100",
    bar: "bg-red-500",
    width: "w-full",
  },
};

interface Vital {
  label: string;
  value: string;
  change: string;
  severity: Severity;
  unit: string;
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
  const vitalsData: Vital[] = [
    {
      label: "Blood Pressure",
      value: `${vitalData?.BP_systolic} / ${vitalData?.BP_diastolic}`,
      unit: "mmHg",
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
      value: `${vitalData?.pulse}`,
      unit: "bpm",
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
      value: `${vitalData?.temperature}`,
      unit: "°F",
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
      value: `${vitalData?.SP02_room_air_without_oxygen}`,
      unit: "%",
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
      value: `${vitalData?.respiration}`,
      unit: "breaths/min",
      change: "+1.0",
      severity:
        vitalData?.respiration < 12 || vitalData?.respiration > 20
          ? "WARNING"
          : "NORMAL",
    },
    {
      label: "Pain Score",
      value: `${vitalData?.pain ?? "N/A"}`,
      unit: "/10",
      change: "0.0",
      severity: vitalData?.pain && vitalData?.pain > 5 ? "WARNING" : "NORMAL",
    },
  ];

  return (
    <div className="p-2 md:p-4 bg-white rounded-lg">
      <div className="grid grid-cols-3 gap-3">
        {vitalsData.map((vital, index) => {
          const { color, bg, bar } = severityStyles[vital.severity];

          return (
            <div
              key={index}
              className="relative p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 truncate w-24">
                  {vital.label}
                </p>
                <span
                  className={`px-2 py-0.5 text-xs font-medium ${color} ${bg} rounded`}
                >
                  {vital.severity}
                </span>
              </div>
              <div className="flex items-baseline mt-1">
                <p className="text-xl font-medium text-gray-900">
                  {vital.value}
                </p>
                <span className="ml-1 text-xs text-gray-500">{vital.unit}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {vital.change} from last
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1">
                <div
                  className={`h-full ${bar} ${vital.severity === "NORMAL" ? "w-full" : vital.severity === "WARNING" ? "w-full" : "w-full"} rounded-b-lg`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalsOverview;