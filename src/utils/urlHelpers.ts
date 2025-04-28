import { getBaseUrl } from "../../src/components/molecules/WidgetMenu/menuData";

/**
 * Generates the appropriate URL for a given category and patient ID
 */
export const getCategoryUrl = (
  category: string | null,
  patientId: string | null
): string => {
  // Get the base URL that handles environment-specific logic
  const baseUrl = getBaseUrl();
  console.log(baseUrl, "base url");

  switch (category) {
    case "Allergies":
      return `${baseUrl}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=allergy`;
    case "Appointments":
      return `${baseUrl}/interface/main/calendar/add_edit_event2.php?startampm=1&starttimeh=6&starttimem=0&patientid=${patientId}&ptype=patient`;
    case "Diagnosis":
      return `${baseUrl}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medical_problem`;
    case "Advanced Directive":
      return `${baseUrl}/interface/patient_file/summary/advancedirectives.php`;
    case "Medications":
      return `${baseUrl}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=medication`;
    case "Insurance":
      return `${baseUrl}//interface/patient_file/summary/add_insurance.php`;
    case "Prescriptions":
      return `${baseUrl}/interface/patient_file/summary/rx_frameset.php`;
    case "Demographics":
      return `${baseUrl}/interface/patient_file/summary/demographics_full.php?curr_tab=Who`;
    case "Functional Status":
      return `${baseUrl}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=functional_status`;
    case "Cognitive Status":
      return `${baseUrl}/interface/patient_file/summary/add_edit_issue.php?showmed=yes&issue=0&thistype=cognitive_status`;
    case "Advanced Directives":
      return `${baseUrl}/interface/patient_file/summary/advancedirectives.php`;
    default:
      return "";
  }
};
