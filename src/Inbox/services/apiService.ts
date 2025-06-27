import axiosClient from "../../api/axiosClient";
import { BirthdayApiResponse } from "../../types";

// Interfaces for API responses
interface UrgentTaskCountApiResponse {
  success: boolean;
  data: {
    high: number;
    medium: number;
    low: number;
  };
}

interface AgendaData {
  pc_eid: number;
  pc_eventDate: string;
  formatted_start_time: string;
  formatted_end_time: string;
  appointment_type: string;
  recurrence_type: string;
  patient_name: string;
  provider: string;
  category: string;
  facility: string;
}

interface AgendaApiResponse {
  columns: any[];
  data: AgendaData[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

// Fetch birthday data from API to get count
export const fetchBirthdayCount = async (): Promise<number> => {
  try {
    const response = await axiosClient.get<BirthdayApiResponse>(
      "/inbox/birthdays",
      {
        params: {
          per_page: 1,
        },
      }
    );
    return response.data.pagination.total;
  } catch (err) {
    console.error("Failed to fetch birthday count:", err);
    throw err;
  }
};

// Fetch agenda data from API to get count
export const fetchAgendaCount = async (): Promise<number> => {
  try {
    const response = await axiosClient.get<AgendaApiResponse>(
      "/inbox/upcoming-appointments"
    );
    return response.data.data.length;
  } catch (err) {
    console.error("Failed to fetch agenda count:", err);
    throw err;
  }
};

// Fetch urgent task counts
export const fetchUrgentTaskCounts = async (): Promise<{
  high: number;
  medium: number;
  low: number;
  assigned_to_me?: number;
  created_by_me?: number;
}> => {
  try {
    const response =
      await axiosClient.get<UrgentTaskCountApiResponse>("/tasks/summary");
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch urgent task counts:", err);
    throw err;
  }
};