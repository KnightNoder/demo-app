// menuData.ts
export interface DropdownMenuItem {
  label: string;
  url: string;
}

export interface MenuItems {
  [key: string]: DropdownMenuItem[];
}


export const getMenuItems = (patientId?: string | null): MenuItems => {
  return {
    "Client Info": [
      {
        label: "Level of Care",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/afrh_fee_assessment/afrh_levelofcare_history.php`,
      },
      {
        label: "Reset Onsite Portal Credentials",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/create_portallogin.php?portalsite=on&patient=${patientId}&sendemail=reset`,
      },
      {
        label: "Admit / Pause / Discharge",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/multiple_adt.php?patient=${patientId}`,
      },
      {
        label: "Facesheet",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/preview_facesheet.php?pid=${patientId}`,
      },
    ],
    Clinical: [
      {
        label: "History (HPI)",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/history/history.php`,
      },
      {
        label: "Transactions",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/transaction/transactions.php`,
      },
      {
        label: "Referrals",
        url: `${import.meta.env.VITE_V1_URL}/interface/practice/referrals/referrals_dashboard.php?from_page=demographics&pid=${patientId}`,
      },
      {
        label: "Diagnosis",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/stats_full.php?active=all`,
      },
      {
        label: "Nutrition Forms",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/nutrition_forms/nutrition_transactions.php?cons_type=forms`,
      },
      {
        label: "MDS Form",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/mds_form/mds_transactions.php?cons_type=forms`,
      },
      {
        label: "Treatment Plan",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/treatment_plan/treatment_plan.php`,
      },
      {
        label: "Treatment Plan",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/treatment_plans/treatment_plan.php`,
      },
      {
        label: "Treatment Plan",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/treatment_plans_v2/treatment_plan_v2.php`,
      },
      {
        label: "Incidents",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/patient_incidents/incidents_details.php?category=Clinical`,
      },
      {
        label: "Root Cause",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/patient_incidents/root_cause_list.php`,
      },
      {
        label: "EMAR V1",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/emar/emar_details.php`,
      },
      {
        label: "EMAR V2",
        url: `${import.meta.env.VITE_V1_URL}/interface/chartmeds/chartmeds_demographics.php`,
      },
      {
        label: "ETAR",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/etar/emar_details.php`,
      },
      {
        label: "Adverse Events",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/adverse_events.php`,
      },
      {
        label: "Clinical Reconciliation",
        url: `${import.meta.env.VITE_V1_URL}/interface/clinical_reconciliation/reconcile.php?rpid=${patientId}`,
      },
      {
        label: "Status Sheet",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/status_sheet/status_sheet_details.php`,
      },
      {
        label: "Interdisciplinary Treatment Plan",
        url: `${import.meta.env.VITE_V1_URL}/interface/builders/plan/index.html`,
      },
    ],
    Documents: [
      {
        label: "Documents",
        url: `${import.meta.env.VITE_V1_URL}/controller.php?document&list&patient_id=${patientId}`,
      },
      {
        label: "ROI",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/roi_forms_list.php`,
      },
      {
        label: "Consent Forms",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/patient_consent_forms/patient_consent_transactions.php?cons_type=forms`,
      },
      {
        label: "CDI Policies",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/patient_consent_forms/patient_consent_transactions.php?cons_type=letters`,
      },
      {
        label: "View Past Clinical Notes",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/past_clinical_notes/past_clinical_notes.php?pid=${patientId}`,
      },
      { label: "No Screening Form", url: "#" },
      {
        label: "CCDA",
        url: `${import.meta.env.VITE_V1_URL}/interface/practice/view_ccda.php`,
      },
      {
        label: "Call Log Manager",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/patient_call_log/call_log_list.php?patient_id=${patientId}`,
      },
    ],
    Reports: [
      {
        label: "Client Reports",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/report/patient_report.php`,
      },
      { label: "Service Report", url: "/reports/service-report" },
      {
        label: "PMP Report",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/pmp_access.php?pid=${patientId}`,
      },
    ],
    Other: [
      {
        label: "MOTS",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/mots/mots_edit_list.php?patient_id=${patientId}&mots_save_id=`,
      },
      {
        label: "DARTS",
        url: `${import.meta.env.VITE_V1_URL}/interface/darts/darts_edit_list.php?patient_id=${patientId}`,
      },
      {
        label: "WITS",
        url: `${import.meta.env.VITE_V1_URL}/interface/wits/records_list.php?patient_id=${patientId}`,
      },
      {
        label: "Payer Code",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/payer_codes/view_payer_codes_list.php`,
      },
      {
        label: "Plan Code",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/plan_code/view_plan_code_list.php`,
      },
      {
        label: "Remove from Audit",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/auditme.php?patient=${patientId}`,
      },
      {
        label: "ER Visits Information",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/summary/patient_emergency_visit_history.php?page_from=demographics&history_id=`,
      },
      {
        label: "Generate Label",
        url: `${import.meta.env.VITE_V1_URL}/interface/orders/generate_label.php`,
      },
      {
        label: "Greenspace Assessments",
        url: `${import.meta.env.VITE_V1_URL}/interface/greenspace_assessments_list.php`,
      },
    ],
    EDI: [
      {
        label: "AHCCCS (Arizona) Supplemental Demographics",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/southwest/dug_segment_data.php?patient_id=${patientId}`,
      },
    ],
    "External Links": [{ label: "External Links", url: "/external-links" }],
    "More Options": [
      { label: "Expand All", url: "" },
      { label: "Collapse All", url: "" },
      {
        label: "Delete Person",
        url: `${import.meta.env.VITE_V1_URL}/interface/patient_file/deleter.php?patient=${patientId}`,
      },
      { label: "Deactivate the Person", url: "" },
    ],
  };
};

// Add function to evaluate the URL templates at runtime
export const getProcessedUrl = (
  url: string,
  patientId?: string | null
): string => {
  // Check if URL is a simple URL without templates
  if (!url.includes("${")) {
    return url;
  }

  let processedUrl = url;

  // Process environment variable
  const viteUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_V1_URL) ||
    "";

  processedUrl = processedUrl.replace(
    /\$\{import\.meta\.env\.VITE_V1_URL\}/g,
    viteUrl
  );

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
  "Client Info",
  "Clinical",
  "Documents",
  "Reports",
  "Other",
  "EDI",
  "External Links",
  "More Options",
];