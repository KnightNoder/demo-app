/**
 * Generates the appropriate URL for a given category and patient ID
 */
export const getCategoryUrl = (
  category: string | null,
  patientId: string | null
): string => {
  switch (category) {
    case "Allergies":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=allergy`;
    case "Appointments":
      return `${import.meta.env.VITE_V1_URL}/interface/main/calendar/add_edit_event2.php?startampm=1&starttimeh=6&starttimem=0&patientid=${patientId}&ptype=patient`;
    case "Diagnosis":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medical_problem`;
    case "Advanced Directive":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/advancedirectives.php`;
    case "Medications":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medication`;
    case "Insurance":
      return `${import.meta.env.VITE_V1_URL}//interface/patient_file/summary/add_insurance.php`;
    case "Prescriptions":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/rx_frameset.php`;
    case "Demographics":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/demographics_full.php?curr_tab=Who`;
    case "Functional Status":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=functional_status`;
    case "Cognitive Status":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=cognitive_status`;
    case "Advanced Directives":
      return `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/advancedirectives.php`;
    default:
      return "";
  }
};