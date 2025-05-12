import React, { useMemo } from "react";
import { LineChart } from "../../atoms/LineChart/LineChart";

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
  patient: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface VitalsTrendProps {
  vitalsDataArray?: VitalData[];
}

const VitalsTrend: React.FC<VitalsTrendProps> = ({ vitalsDataArray = [] }) => {
  const transformedData = useMemo(() => {
    if (!vitalsDataArray || vitalsDataArray.length === 0) {
      return [];
    }

    // Sort by date ascending
    const sortedData = [...vitalsDataArray].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Transform to format needed by LineChart
    return sortedData?.map((record) => ({
      timestamp: new Date(record.date).getTime(),
      systolic: record.BP_systolic,
      diastolic: record.BP_diastolic,
      heartRate: record.pulse,
      spo2: record.SP02_room_air_without_oxygen,
      temperature: record.temperature,
      respiration: record.respiration,
    }));
  }, [vitalsDataArray]);

  // If no data is available, show a message
  if (transformedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-500">No vital trend data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Blood Pressure Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Blood Pressure Trend
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <LineChart
            data={transformedData}
            xKey="timestamp"
            yKeys={["systolic", "diastolic"]}
          />
        </div>
      </div>

      {/* Heart Rate Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Heart Rate Trend
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <LineChart
            data={transformedData}
            xKey="timestamp"
            yKeys={["heartRate"]}
          />
        </div>
      </div>

      {/* SpO2 Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Oxygen Saturation Trend
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <LineChart data={transformedData} xKey="timestamp" yKeys={["spo2"]} />
        </div>
      </div>

      {/* Temperature Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Temperature Trend
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <LineChart
            data={transformedData}
            xKey="timestamp"
            yKeys={["temperature"]}
          />
        </div>
      </div>

      {/* Respiratory Rate Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Respiratory Rate Trend
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <LineChart
            data={transformedData}
            xKey="timestamp"
            yKeys={["respiration"]}
          />
        </div>
      </div>
    </div>
  );
};

export default VitalsTrend;
