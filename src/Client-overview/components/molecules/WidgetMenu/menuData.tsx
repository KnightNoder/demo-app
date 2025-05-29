import { getBaseUrl } from "../../../../utils/utils";

// menuData.ts
export interface DropdownMenuItem {
  label: string;
  url: string;
}

export interface MenuItems {
  [key: string]: DropdownMenuItem[];
}

// Helper function to determine if we're in production
// const isStaging = (): boolean => {
//   return import.meta.env.VITE_ENV === "staging";
// };

// Helper to get base URL with proper environment handling
// export const getBaseUrl = (): string => {
//   // Get the base URL from environment
//   const baseUrl =
//     (typeof import.meta !== "undefined" &&
//       import.meta.env &&
//       import.meta.env.VITE_V1_URL) ||
//     "";

//   // Append "/ehr" in Staging environment
//   return isStaging() ? `${baseUrl}/ehr` : baseUrl;
// }

export const getMenuItems = (patientId?: string | null): MenuItems => {
  // Pre-calculate the base URL to use in all menu items
  // const baseUrl = getBaseUrl();
  console.log(patientId);

  return {
    // "Client Info": [
    //   {
    //     label: "Level of Care",
    //     url: `${baseUrl}/interface/patient_file/afrh_fee_assessment/afrh_levelofcare_history.php`,
    //   },
    //   {
    //     label: "Reset Onsite Portal Credentials",
    //     url: `${baseUrl}/interface/patient_file/summary/create_portallogin.php?portalsite=on&patient=${patientId}&sendemail=reset`,
    //   },
    //   {
    //     label: "Admit / Pause / Discharge",
    //     url: `${baseUrl}/interface/patient_file/summary/multiple_adt.php?patient=${patientId}`,
    //   },
    //   {
    //     label: "Facesheet",
    //     url: `${baseUrl}/interface/patient_file/summary/preview_facesheet.php?pid=${patientId}`,
    //   },
    // ],
    // Clinical: [
    //   {
    //     label: "History (HPI)",
    //     url: `${baseUrl}/interface/patient_file/history/history.php`,
    //   },
    //   {
    //     label: "Transactions",
    //     url: `${baseUrl}/interface/patient_file/transaction/transactions.php`,
    //   },
    //   {
    //     label: "Referrals",
    //     url: `${baseUrl}/interface/practice/referrals/referrals_dashboard.php?from_page=demographics&pid=${patientId}`,
    //   },
    //   {
    //     label: "Diagnosis",
    //     url: `${baseUrl}/interface/patient_file/summary/stats_full.php?active=all`,
    //   },
    //   {
    //     label: "Nutrition Forms",
    //     url: `${baseUrl}/interface/patient_file/nutrition_forms/nutrition_transactions.php?cons_type=forms`,
    //   },
    //   {
    //     label: "MDS Form",
    //     url: `${baseUrl}/interface/patient_file/mds_form/mds_transactions.php?cons_type=forms`,
    //   },
    //   {
    //     label: "Treatment Plan",
    //     url: `${baseUrl}/interface/patient_file/treatment_plan/treatment_plan.php`,
    //   },
    //   {
    //     label: "Treatment Plan",
    //     url: `${baseUrl}/interface/patient_file/treatment_plans/treatment_plan.php`,
    //   },
    //   {
    //     label: "Treatment Plan",
    //     url: `${baseUrl}/interface/patient_file/treatment_plans_v2/treatment_plan_v2.php`,
    //   },
    //   {
    //     label: "Incidents",
    //     url: `${baseUrl}/interface/patient_file/patient_incidents/incidents_details.php?category=Clinical`,
    //   },
    //   {
    //     label: "Root Cause",
    //     url: `${baseUrl}/interface/patient_file/patient_incidents/root_cause_list.php`,
    //   },
    //   {
    //     label: "EMAR V1",
    //     url: `${baseUrl}/interface/patient_file/emar/emar_details.php`,
    //   },
    //   {
    //     label: "EMAR V2",
    //     url: `${baseUrl}/interface/chartmeds/chartmeds_demographics.php`,
    //   },
    //   {
    //     label: "ETAR",
    //     url: `${baseUrl}/interface/patient_file/etar/emar_details.php`,
    //   },
    //   {
    //     label: "Adverse Events",
    //     url: `${baseUrl}/interface/patient_file/summary/adverse_events.php`,
    //   },
    //   {
    //     label: "Clinical Reconciliation",
    //     url: `${baseUrl}/interface/clinical_reconciliation/reconcile.php?rpid=${patientId}`,
    //   },
    //   {
    //     label: "Status Sheet",
    //     url: `${baseUrl}/interface/patient_file/status_sheet/status_sheet_details.php`,
    //   },
    //   {
    //     label: "Interdisciplinary Treatment Plan",
    //     url: `${baseUrl}/interface/builders/plan/index.html`,
    //   },
    // ],
    // Documents: [
    //   {
    //     label: "Documents",
    //     url: `${baseUrl}/controller.php?document&list&patient_id=${patientId}`,
    //   },
    //   {
    //     label: "ROI",
    //     url: `${baseUrl}/interface/patient_file/roi_forms_list.php`,
    //   },
    //   {
    //     label: "Consent Forms",
    //     url: `${baseUrl}/interface/patient_file/patient_consent_forms/patient_consent_transactions.php?cons_type=forms`,
    //   },
    //   {
    //     label: "CDI Policies",
    //     url: `${baseUrl}/interface/patient_file/patient_consent_forms/patient_consent_transactions.php?cons_type=letters`,
    //   },
    //   {
    //     label: "View Past Clinical Notes",
    //     url: `${baseUrl}/interface/patient_file/past_clinical_notes/past_clinical_notes.php?pid=${patientId}`,
    //   },
    //   { label: "No Screening Form", url: "#" },
    //   {
    //     label: "CCDA",
    //     url: `${baseUrl}/interface/practice/view_ccda.php`,
    //   },
    //   {
    //     label: "Call Log Manager",
    //     url: `${baseUrl}/interface/patient_file/patient_call_log/call_log_list.php?patient_id=${patientId}`,
    //   },
    // ],
    // Reports: [
    //   {
    //     label: "Client Reports",
    //     url: `${baseUrl}/interface/patient_file/report/patient_report.php`,
    //   },
    //   { label: "Service Report", url: "#" },
    //   {
    //     label: "PMP Report",
    //     url: `${baseUrl}/interface/patient_file/summary/pmp_access.php?pid=${patientId}`,
    //   },
    // ],
    // Other: [
    //   {
    //     label: "MOTS",
    //     url: `${baseUrl}/interface/patient_file/mots/mots_edit_list.php?patient_id=${patientId}&mots_save_id=`,
    //   },
    //   {
    //     label: "DARTS",
    //     url: `${baseUrl}/interface/darts/darts_edit_list.php?patient_id=${patientId}`,
    //   },
    //   {
    //     label: "WITS",
    //     url: `${baseUrl}/interface/wits/records_list.php?patient_id=${patientId}`,
    //   },
    //   {
    //     label: "Payer Code",
    //     url: `${baseUrl}/interface/patient_file/payer_codes/view_payer_codes_list.php`,
    //   },
    //   {
    //     label: "Plan Code",
    //     url: `${baseUrl}/interface/patient_file/plan_code/view_plan_code_list.php`,
    //   },
    //   {
    //     label: "Remove from Audit",
    //     url: `${baseUrl}/interface/patient_file/summary/auditme.php?patient=${patientId}`,
    //   },
    //   {
    //     label: "ER Visits Information",
    //     url: `${baseUrl}/interface/patient_file/summary/patient_emergency_visit_history.php?page_from=demographics&history_id=`,
    //   },
    //   {
    //     label: "Generate Label",
    //     url: `${baseUrl}/interface/orders/generate_label.php`,
    //   },
    //   {
    //     label: "Greenspace Assessments",
    //     url: `${baseUrl}/interface/greenspace_assessments_list.php`,
    //   },
    // ],
    // EDI: [
    //   {
    //     label: "AHCCCS (Arizona) Supplemental Demographics",
    //     url: `${baseUrl}/interface/patient_file/southwest/dug_segment_data.php?patient_id=${patientId}`,
    //   },
    // ],
    // "External Links": [{ label: "External Links", url: "#" }],
    "More Options": [
      { label: "Expand All", url: "" },
      { label: "Collapse All", url: "" },
      // {
      //   label: "Delete Person",
      //   url: `${baseUrl}/interface/patient_file/deleter.php?patient=${patientId}`,
      // },
      // { label: "Deactivate the Person", url: "#" },
    ],
  };
};

// Now this function is simpler as all the environment processing is handled
// in getBaseUrl() which is used by getMenuItems()
export const getProcessedUrl = (
  url: string,
  patientId?: string | null
): string => {
  // Check if URL is a simple URL without templates
  if (!url.includes("${")) {
    return url;
  }

  let processedUrl = url;

  // Process environment variable template
  if (url.includes("${import.meta.env.VITE_V1_URL}")) {
    processedUrl = processedUrl.replace(
      /\$\{import\.meta\.env\.VITE_V1_URL\}/g,
      getBaseUrl()
    );
  }

  // Process patientId
  if (patientId) {
    processedUrl = processedUrl.replace(/\$\{patientId\}/g, patientId);
  } else {
    // If no patientId provided, replace with empty string to avoid broken URLs
    processedUrl = processedUrl.replace(/\$\{patientId\}/g, "");
  }

  return processedUrl;
};

export const allMenuItems = [
  // "Client Info",
  // "Clinical",
  // "Documents",
  // "Reports",
  // "Other",
  // "EDI",
  // "External Links",
  "More Options",
];
