const VitalsTable = () => {
  return (
    <div className="p-4 mt-4 bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-left">BP</th>
            <th className="p-2 text-left">HR</th>
            <th className="p-2 text-left">Temp</th>
            <th className="p-2 text-left">SpO2</th>
            <th className="p-2 text-left">RR</th>
            <th className="p-2 text-left">Pain</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">4:16:42 PM</td>
            <td className="p-2">129.8/81.4</td>
            <td className="p-2">63.1</td>
            <td className="p-2">98.6</td>
            <td className="p-2">96.0</td>
            <td className="p-2">11.5</td>
            <td className="p-2">2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VitalsTable;
