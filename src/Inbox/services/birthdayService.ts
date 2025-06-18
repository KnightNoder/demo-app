// src/services/inbox/birthdayService.ts
import axiosClient from "../../api/axiosClient";
import { BirthdayApiResponse, BirthdayData } from "../../types";

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
    throw new Error("Failed to load birthday count");
  }
};

export const fetchBirthdayDataForPanel = async (): Promise<{
  tasks: any[];
  columns: any[];
}> => {
  try {
    const response = await axiosClient.get<BirthdayApiResponse>(
      "/inbox/birthdays",
      {
        params: {
          per_page: 1000,
        },
      }
    );

    const transformedTasks = response.data.data.map((birthday: BirthdayData) => ({
      id: birthday.pid.toString(),
      title: `Birthday: ${birthday.name}`,
      description: `DOB: ${birthday.DOB}`,
      assignedTo: birthday.name,
      person: birthday.name,
      dueDate: birthday.DOB,
      priority: "medium",
      status: "pending",
      type: "birthday",
      ...birthday,
    }));

    const capitalizedColumns = response.data.columns.map((column) => ({
      ...column,
      label: capitalizeLabel(column.label),
    }));

    return {
      tasks: transformedTasks,
      columns: capitalizedColumns,
    };
  } catch (err) {
    console.error("Failed to fetch birthday data for panel:", err);
    throw new Error("Failed to load birthday data");
  }
};

function capitalizeLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}