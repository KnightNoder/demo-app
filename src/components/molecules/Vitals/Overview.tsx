import React from "react";

type Severity = "NORMAL" | "WARNING" | "CRITICAL";

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

const severityStyles: Record<
  Severity,
  { color: string; bg: string; border: string; ring: string }
> = {
  NORMAL: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-600/20",
  },
  WARNING: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-600/20",
  },
  CRITICAL: {
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-600/20",
  },
};

interface Vital {
  label: string;
  value: string;
  severity: Severity;
  unit: string;
}

interface CriticalAlert {
  message: string;
  recommendation: string;
}

interface BaselineVital {
  label: string;
  value: string;
}

interface Condition {
  label: string;
  value: string;
}

interface VitalsOverviewProps {
  vitalData?: VitalData;
}

const VitalsOverview: React.FC<VitalsOverviewProps> = ({ vitalData }) => {
  // Generate vitals data from props
  const vitalsData: Vital[] = [
    {
      label: "Blood Pressure",
      value: `${vitalData?.BP_systolic || 120.7} / ${vitalData?.BP_diastolic || 87.8}`,
      unit: "mmHg",
      severity:
        vitalData?.BP_systolic &&
        (vitalData.BP_systolic < 50 || vitalData.BP_systolic > 200)
          ? "CRITICAL"
          : vitalData?.BP_systolic &&
              vitalData.BP_systolic >= 80 &&
              vitalData.BP_systolic <= 120
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "Heart Rate",
      value: `${vitalData?.pulse || 72.0}`,
      unit: "bpm",
      severity:
        vitalData?.pulse && (vitalData.pulse < 40 || vitalData.pulse > 160)
          ? "CRITICAL"
          : vitalData?.pulse && vitalData.pulse >= 60 && vitalData.pulse <= 80
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "Temperature",
      value: `${vitalData?.temperature || 98.3}`,
      unit: "°F",
      severity:
        vitalData?.temperature &&
        (vitalData.temperature < 92 || vitalData.temperature > 103)
          ? "CRITICAL"
          : vitalData?.temperature &&
              vitalData.temperature >= 97 &&
              vitalData.temperature <= 99
            ? "NORMAL"
            : "WARNING",
    },
    {
      label: "SpO2",
      value: `${vitalData?.SP02_room_air_without_oxygen || 97.5}`,
      unit: "%",
      severity:
        vitalData?.SP02_room_air_without_oxygen &&
        vitalData.SP02_room_air_without_oxygen < 90
          ? "CRITICAL"
          : vitalData?.SP02_room_air_without_oxygen &&
              vitalData.SP02_room_air_without_oxygen < 95
            ? "WARNING"
            : "NORMAL",
    },
    {
      label: "Respiratory Rate",
      value: `${vitalData?.respiration || 9.4}`,
      unit: "breaths/min",
      severity:
        vitalData?.respiration &&
        (vitalData.respiration < 12 || vitalData.respiration > 20)
          ? "CRITICAL"
          : "NORMAL",
    },
    {
      label: "Pain Score",
      value: `${vitalData?.pain ?? "--"}`,
      unit: "/10",
      severity: vitalData?.pain && vitalData.pain > 5 ? "WARNING" : "NORMAL",
    },
  ];

  // Generate critical alerts dynamically based on vitals with CRITICAL severity
  const criticalAlerts: CriticalAlert[] = vitalsData
    ?.filter((vital) => vital.severity === "CRITICAL")
    ?.map((vital) => {
      // Customize messages based on vital type
      switch (vital.label) {
        case "Blood Pressure":
          const bpValues = vital.value.split("/");
          const systolic = parseFloat(bpValues[0].trim());
          const message =
            systolic < 90 ? "Low blood pressure" : "High blood pressure";
          return {
            message,
            recommendation: "Monitor closely and assess medication regimen",
          };
        case "Heart Rate":
          const hr = parseFloat(vital.value);
          const hrMessage = hr < 60 ? "Low heart rate" : "High heart rate";
          return {
            message: hrMessage,
            recommendation:
              "Check cardiac medications and monitor for signs of distress",
          };
        case "Temperature":
          const temp = parseFloat(vital.value);
          const tempMessage = temp < 97 ? "Hypothermia" : "Hyperthermia";
          return {
            message: tempMessage,
            recommendation: "Assess for infection or environmental causes",
          };
        case "SpO2":
          return {
            message: "Low oxygen saturation",
            recommendation: "Consider supplemental oxygen assessment",
          };
        case "Respiratory Rate":
          const resp = parseFloat(vital.value);
          const respMessage = resp < 12 ? "Bradypnea" : "Tachypnea";
          return {
            message: respMessage,
            recommendation:
              "Assess for respiratory distress and underlying causes",
          };
        default:
          return {
            message: `Abnormal ${vital.label.toLowerCase()}`,
            recommendation: "Further assessment recommended",
          };
      }
    });

  // Define baseline vitals
  const baselineVitals: BaselineVital[] = [
    { label: "BP", value: "118/78 mmHg" },
    { label: "HR", value: "68 bpm" },
  ];

  // Define relevant conditions
  const relevantConditions: Condition[] = [
    { label: "HTN", value: "Active" },
    { label: "DM Type 2", value: "Well-controlled" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50">
      {/* Vitals Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vitalsData?.map((vital, index) => {
          const { color, bg, ring } = severityStyles[vital.severity];

          return (
            <div
              key={index}
              className="relative p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-200"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-normal text-[#020817] truncate">
                      {vital.label}
                    </span>
                    <div
                      className={`inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-gray-200 hover:bg-gray-50 rounded-md px-1 py-0.5 text-xs font-light ml-1 whitespace-nowrap ${bg} ${color} ${ring}`}
                    >
                      {vital.severity}
                    </div>
                  </div>

                  {/* BP is special because it has two values */}
                  {vital.label === "Blood Pressure" ? (
                    <div className="flex items-baseline gap-0.5 mt-0.5">
                      <span className="text-sm font-normal text-[#020817] tracking-tight leading-none">
                        {vitalData?.BP_systolic || 120.7}
                      </span>
                      <span className="text-slate-300 mx-0.5">/</span>
                      <span className="text-sm font-normal text-[#020817] tracking-tight leading-none">
                        {vitalData?.BP_diastolic || 87.8}
                      </span>
                      <span className="text-xs font-light text-gray-600 ml-0.5 whitespace-nowrap">
                        {vital.unit}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-0.5 mt-0.5">
                      <span className="text-sm font-normal text-[#020817] tracking-tight leading-none">
                        {vital.value}
                      </span>
                      <span className="text-xs font-light text-gray-600 ml-0.5 whitespace-nowrap">
                        {vital.unit}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-0.5 mt-1">
                {/* <span className="text-xs font-light text-gray-600 leading-none whitespace-nowrap">
                  {vital.change.split(" ")[0]}
                </span>
                <span className="text-xs font-light text-gray-600 leading-none whitespace-nowrap">
                  from last
                </span> */}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    vital.severity === "NORMAL"
                      ? "bg-emerald-500"
                      : vital.severity === "WARNING"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }`}
                  style={{ width: "73%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts Section */}
      <div className="bg-white rounded-md mt-4 p-4 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-normal text-[#020817] mb-3">
          Critical Alerts
        </h2>
        {criticalAlerts.length > 0 ? (
          criticalAlerts?.map((alert, index) => (
            <div
              key={index}
              className="flex items-start border border-gray-100 rounded p-2 mb-2"
            >
              <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 mr-2"></div>
              <div>
                <span className="text-xs font-normal text-[#020817]">
                  {alert.message} -{" "}
                </span>
                <span className="text-xs font-light text-gray-600">
                  {alert.recommendation}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs font-light text-gray-600">
            No critical alerts at this time.
          </div>
        )}
      </div>

      {/* Clinical Context Section */}
      <div className="bg-white rounded-md mt-4 p-4 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-normal text-[#020817] mb-3">
          Clinical Context
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Vitals */}
          <div className="rounded-md p-4 border border-gray-200">
            <h3 className="text-xs font-normal text-[#020817] mb-2">
              Baseline Vitals
            </h3>
            <div className="space-y-2">
              {baselineVitals?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-xs font-light text-gray-600">
                    {item.label}
                  </span>
                  <span className="text-xs font-normal text-[#020817]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Conditions */}
          <div className="rounded-md p-4 border border-gray-200">
            <h3 className="text-xs font-normal text-[#020817] mb-2">
              Relevant Conditions
            </h3>
            <div className="space-y-2">
              {relevantConditions?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-xs font-light text-gray-600">
                    {item.label}
                  </span>
                  <span className="text-xs font-normal text-[#020817]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsOverview;