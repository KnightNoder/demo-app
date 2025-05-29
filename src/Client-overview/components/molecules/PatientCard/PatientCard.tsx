import React, { useEffect, useState } from "react";

interface PatientCardProps {
  patientImage?: string;
}

interface DecodedToken {
  name?: string;
  user_id?: string;
  id?: string;
  [key: string]: any;
}

const PatientCard: React.FC<PatientCardProps> = ({ patientImage }) => {
  const [patientName, setPatientName] = useState<string>("--");
  const [patientId, setPatientId] = useState<string>("--");

  useEffect(() => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("JWT_AUTH_TOKEN");

      if (token) {
        // Decode the JWT token
        const decodedToken = decodeJWT(token);

        // Set patient name and ID from the decoded token
        if (decodedToken.username) {
          setPatientName(decodedToken.username);
        }

        // Use user_id or id from the token
        if (decodedToken.user_id) {
          setPatientId(decodedToken.user_id);
        } else if (decodedToken.id) {
          setPatientId(decodedToken.id);
        }
      }
    } catch (error) {
      console.error("Error decoding JWT token:", error);
    }
  }, []);

  // Function to decode JWT token
  const decodeJWT = (token: string): DecodedToken => {
    try {
      // JWT tokens are three parts separated by dots
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      // The second part of the token is the payload
      const payload = parts[1];

      // Base64Url decode and parse the payload
      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return {};
    }
  };

  return (
    <div className="w-full max-w-md aspect-[1.6/1] bg-slate-100 rounded-xl shadow-md relative overflow-hidden mb-6 mx-auto">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100"></div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.2)_40%)]"></div>
        <div className="absolute right-0 inset-y-0 w-1/2 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1)_0%,transparent_60%)]"></div>
      </div>

      {/* Content */}
      <div className="relative h-full p-5 flex flex-col">
        {/* Header section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-800 font-semibold tracking-wide">
              Kaiser Permanente
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Patient Identification
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/80 shadow-sm backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl">🏥</span>
          </div>
        </div>

        {/* Middle section */}
        <div className="flex-1 flex items-center gap-4 my-3">
          <div className="w-20 h-20 rounded-xl bg-white/80 shadow-sm backdrop-blur-sm flex items-center justify-center">
            {patientImage ? (
              <img
                src={patientImage}
                alt="Patient"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-10 h-10 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg text-slate-800 font-medium tracking-wide truncate mb-2">
              {patientName}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  ID Number
                </p>
                <p className="text-sm text-slate-700 truncate">{patientId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Date of Birth
                </p>
                <p className="text-sm text-slate-700 truncate">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          {/* <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Gender
            </p>
            <p className="text-sm text-slate-700">--</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Emergency Contact
            </p>
            <p className="text-sm text-slate-700">--</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
