import React, { useEffect, useState } from "react";
import {LineChart} from "../../atoms/LineChart/LineChart";

interface VitalsTrendProps {
  interval?: number; // Interval for new data updates in milliseconds
}

const VitalsTrend: React.FC<VitalsTrendProps> = ({ interval = 2000 }) => {
  const generateMockData = (size = 10) => {
    const now = Date.now();
    return Array.from({ length: size }, (_, i) => ({
      timestamp: now - (size - i) * 2000,
      systolic: 110 + Math.floor(Math.random() * 20),
      diastolic: 70 + Math.floor(Math.random() * 15),
      heartRate: 65 + Math.floor(Math.random() * 10),
      spo2: 95 + Math.floor(Math.random() * 5),
      temperature: 36 + Math.random() * 2
    }));
  };
  
  const generateNewVitalsData = () => ({
    timestamp: Date.now(),
    systolic: 110 + Math.floor(Math.random() * 20),
    diastolic: 70 + Math.floor(Math.random() * 15),
    heartRate: 65 + Math.floor(Math.random() * 10),
    spo2: 95 + Math.floor(Math.random() * 5),
    temperature: 36 + Math.random() * 2
  });
  const [data, setData] = useState(() => generateMockData());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1), generateNewVitalsData()];
        return newData;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return (
    <div className="space-y-6">
      {/* Blood Pressure Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Blood Pressure Trend</h3>
        <LineChart data={data} xKey="timestamp" yKeys={["systolic", "diastolic"]} />
      </div>

      {/* Heart Rate & SpO2 Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Heart Rate & SpO2 Trend</h3>
        <LineChart data={data} xKey="timestamp" yKeys={["heartRate", "spo2"]} />
      </div>

      {/* Temperature Trend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Temperature Trend</h3>
        <LineChart data={data} xKey="timestamp" yKeys={["temperature"]} />
      </div>
    </div>
  );
};

export default VitalsTrend;
