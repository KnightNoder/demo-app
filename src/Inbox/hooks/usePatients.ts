import { useState, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

interface Patient {
  name: string;
  age: string | null;
  sex: string;
}

interface PatientsApiResponse {
  success: boolean;
  data: Patient[];
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setPatientsLoading(true);
    setPatientsError(null);
    try {
      const response = await axiosClient.get<PatientsApiResponse>("/patients");
      if (response.data.success) {
        setPatients(response.data.data);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (error) {
      const errorMessage = "Failed to fetch patients.";
      setPatientsError(errorMessage);
      console.error(errorMessage, error);
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  return { patients, patientsLoading, patientsError, fetchPatients };
};
