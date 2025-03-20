import { useState } from "react";

interface PatientCardProps {
  patientImage: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patientImage }) => {
  const [insuranceCard, setInsuranceCard] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setInsuranceCard(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Patient Info Card */}
      <div className="p-6 bg-white shadow-lg rounded-2xl w-96">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg">
            <img src={decodeURIComponent(patientImage)} alt="PatientImage" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">John Smith</h2>
            <p className="text-sm text-gray-500">ID NUMBER: 1</p>
            <p className="text-sm text-gray-500">DATE OF BIRTH: 5/15/1990</p>
          </div>
        </div>
        <div className="pt-4 mt-4 text-sm text-gray-600 border-t">
          <p>
            <strong>GENDER:</strong> Male
          </p>
          <p>
            <strong>EMERGENCY CONTACT:</strong> (555) 123-4567
          </p>
        </div>
      </div>

      {/* Insurance Card Upload Section */}
      <div className="p-6 bg-white shadow-lg rounded-2xl w-96">
        <h3 className="text-lg font-semibold">Insurance Card</h3>
        <div className="flex flex-col items-center p-6 mt-4 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
          {insuranceCard ? (
            <img
              src={insuranceCard}
              alt="Insurance Card"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-10 h-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="mt-2 text-gray-500">No insurance card uploaded</p>
            </div>
          )}
        </div>
        <label className="flex items-center justify-center mt-4 space-x-2 font-medium text-blue-500 cursor-pointer">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span>Upload New</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default PatientCard;