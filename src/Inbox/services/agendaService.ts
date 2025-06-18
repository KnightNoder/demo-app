import axiosClient from "../../api/axiosClient";

// ADD: New method for fetching agenda data for the slide panel
export const fetchAgendaDataForPanel = async () => {
  try {
    const response = await axiosClient.get("/inbox/upcoming-appointments", {
      params: {
        per_page: 10000, // Get all appointments
      },
    });

    // Transform agenda data to ExtendedTask format
    const transformedTasks = response.data.data.map(
      (appointment: any, index: number) => ({
        id: appointment.pc_eid.toString(),
        title: `${appointment.appointment_type}: ${appointment.patient_name || "Group Session"}`,
        description: `${appointment.category} at ${appointment.facility}`,
        assignedTo: appointment.provider,
        person: appointment.patient_name || "Group",
        dueDate: appointment.pc_eventDate,
        priority: "medium" as const,
        status: "pending" as const,
        type: "appointment" as const,
        // Include all original appointment data for dynamic column access
        ...appointment,
        name: appointment.patient_name, // Map for consistency
        time_range: `${appointment.formatted_start_time} - ${appointment.formatted_end_time}`,
      })
    );

    // Enhanced columns for better display
    const enhancedColumns = [
      { key: "pc_eventDate", label: "Date" },
      { key: "time_range", label: "Time" },
      { key: "appointment_type", label: "Type" },
      { key: "recurrence_type", label: "Recurrence" },
      { key: "name", label: "Person" },
      { key: "provider", label: "Provider" },
      { key: "category", label: "Category" },
      { key: "facility", label: "Program" },
    ];

    return {
      tasks: transformedTasks,
      columns: enhancedColumns,
    };
  } catch (error) {
    console.error("Failed to fetch agenda data for panel:", error);
    throw error;
  }
};