import axiosClient from "./axiosClient";

export const getAllergyDataFromApi = async (patientId: string | null) => {
  try {
    const response = await axiosClient.get(`/allergies/${patientId}/`);
    console.log(response.data, "resp data");

    return response.data;
  } catch (error) {
    console.error("Error fetching allergy data:", error);
    throw error;
  }
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // reject("lol"); // Resolve with the diagnosis data
  //     resolve(getAllergyData());
  //   }, 2000); // Simulate a 2-second delay
  // });
};

export const getDiagnosisDataFromApi = async (patientId: string | null) => {
  const response = await axiosClient.get(`/medical-problems?pid=${patientId}`);

  console.log(response.data, "api response");
  return response.data;
};

// const getClinicalNotesDataFromApi = async (patientId: string | null) => {
//   try {
//     const response = await axiosClient.get(`/clinical-notes/${patientId}/`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching clinical notes data:", error);
//     throw error;
//   }
// };

export const getMedicationsDataFromApi = async (patientId: string | null) => {
  try {
    const response = await axiosClient.get(`/medications/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinical notes data:", error);
    throw error;
  }
};

export const getInsuranceDataFromApi = async (patientId: string | null) => {
  try {
    const response = await axiosClient.get(`/insurance-data?pid=${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching insurance data:", error);
    throw error;
  }
};

export const getLabResultsDataFromApi = async (patientId: string | null) => {
  try {
    // const response = await axiosClient.get(
    //   `/lab-order?patient_id=${patientId}`
    // );
    // return response.data;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // reject("lol"); // Resolve with the diagnosis data
        resolve(getLabReportsDataFromApi());
      }, 2000); // Simulate a 2-second delay
    });
  } catch (error) {
    console.error("Error fetching insurance data:", error);
    throw error;
  }
};

// const getPrescriptionsDataFromApi = async (patientId: string | null) => {
//   try {
//     const response = await axiosClient.get(
//       `/prescriptions?patient_id=${patientId}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching insurance data:", error);
//     throw error;
//   }
// };

// const getDiagnosisData = () => {
//   return [
//     {
//       id: "7162751389876096327",
//       title: "ICD10:F99(Mental disorder, not otherwise specified)",
//       begdate: "2024-10-30T02:02:00.000000Z",
//       outcome: 0,
//       primary_diagnosis_code: 0,
//       modified_by: "dhamodhar",
//       modified_on: "2024-11-13T02:03:33.000000Z",
//     },
//     {
//       id: "7162751389876096326",
//       title: "ICD10:Z13.9(Encounter for screening, unspecified)",
//       begdate: "2025-01-01T15:31:14.000000Z",
//       outcome: 0,
//       primary_diagnosis_code: 0,
//       modified_by: "admin",
//       modified_on: "2025-01-31T15:32:51.000000Z",
//     },
//     {
//       id: "7162860202001884056",
//       title: "ICD10:A03.0(Shigellosis due to Shigella dysenteriae)",
//       begdate: "2025-01-20T15:38:44.000000Z",
//       outcome: 0,
//       primary_diagnosis_code: 0,
//       modified_by: "admin",
//       modified_on: "2025-01-31T15:39:21.000000Z",
//     },
//     {
//       id: "7162860202001884041",
//       title: "ICD10:F41.9(Anxiety disorder, unspecified)",
//       begdate: "2025-01-31T15:36:03.000000Z",
//       outcome: 7,
//       primary_diagnosis_code: 0,
//       modified_by: "admin",
//       modified_on: "2025-01-31T17:33:12.000000Z",
//     },
//   ];
// };

// const getAllergyData = () => {
//   return [
//     {
//       id: "7162860202000553277",
//       type: "allergy",
//       allergen: "Peanuts",
//       title: "ICD10:G30.0(Alzheimer's disease with early onset)",
//       begdate: "2025-01-01",
//       enddate: "2025-01-31",
//       diagnosis: "ICD10:G30.0",
//       reaction: {
//         id: "reaction",
//       },
//       severity: {
//         id: "severe",
//       },
//     },
//     {
//       id: "7162860202000553295",
//       allergen: "Pencillin",
//       type: "allergy",
//       title:
//         "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
//       begdate: "2025-01-01",
//       enddate: "2025-01-31",
//       diagnosis: "ICD10:T84.81XD",
//       reaction: {
//         id: "reaction",
//       },
//       severity: {
//         id: "severe",
//       },
//     },
//     {
//       id: "7162860202000553277",
//       type: "allergy",
//       allergen: "Peanuts",
//       title: "ICD10:G30.0(Alzheimer's disease with early onset)",
//       begdate: "2025-01-01",
//       enddate: "2025-01-31",
//       diagnosis: "ICD10:G30.0",
//       reaction: {
//         id: "reaction",
//       },
//       severity: {
//         id: "severe",
//       },
//     },
//     {
//       id: "7162860202000553295",
//       allergen: "Pencillin",
//       type: "allergy",
//       title:
//         "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
//       begdate: "2025-01-01",
//       enddate: "2025-01-31",
//       diagnosis: "ICD10:T84.81XD",
//       reaction: {
//         id: "reaction",
//       },
//       severity: {
//         id: "severe",
//       },
//     },
//   ];
// };

// const getInsuranceData = () => {
//   return [
//     {
//       id: "7160965258201788542",
//       type: "primary",
//       provider: "100265",
//       plan_name: "RC-IDP",
//       policy_number: "Test123",
//       group_number: "GRP123",
//       subscriber: {
//         last_name: "Jon",
//         first_name: "Sam",
//         middle_name: "Mike",
//         relationship: "spouse",
//         dob: "1988-02-09",
//         street: "Newjercy",
//         postal_code: "98698798",
//         city: "Kom",
//         state: "AL",
//         country: "USA",
//         phone: "986-987-9879",
//         employer: "Test S Empoyer",
//       },
//       relationship: "Self",
//       validity: "2025-12-31",
//       contact: "123-456-7890",
//       lastVerified: "2024-01-01",
//       deductibleRemaining: "$500",
//       outOfPocketRemaining: "$1500",
//       status: "Active",
//       copays: {
//         primaryCare: "$20",
//         specialistVisit: "$40",
//         urgentCare: "$50",
//         emergencyRoom: "$150",
//       },
//       insurance_company: {
//         name: "(Medicaid) AETNA",
//       },
//       effective_date: "2025-02-01",
//       termination_date: "2025-02-13",
//       coverage: [
//         { name: "Hospital Stay", covered: true },
//         { name: "Dental", covered: false, note: "Not included in this plan" },
//         { name: "Prescription Drugs", covered: true },
//       ],
//     },
//     {
//       id: "7160965258201788542",
//       type: "Secondary",
//       provider: "100265",
//       plan_name: "RC-IDP",
//       policy_number: "Test123",
//       group_number: "GRP123",
//       subscriber: {
//         last_name: "Jon",
//         first_name: "Sam",
//         middle_name: "Mike",
//         relationship: "spouse",
//         dob: "1988-02-09",
//         street: "Newjercy",
//         postal_code: "98698798",
//         city: "Kom",
//         state: "AL",
//         country: "USA",
//         phone: "986-987-9879",
//         employer: "Test S Empoyer",
//       },
//       effective_date: "2025-02-01",
//       termination_date: "2025-02-13",
//       relationship: "Self",
//       validity: "2025-12-31",
//       contact: "123-456-7890",
//       lastVerified: "2024-01-01",
//       deductibleRemaining: "$500",
//       outOfPocketRemaining: "$1500",
//       status: "Active",
//       copays: {
//         primaryCare: "$20",
//         specialistVisit: "$40",
//         urgentCare: "$50",
//         emergencyRoom: "$150",
//       },
//       insurance_company: {
//         name: "(Medicaid) AETNA",
//       },
//       coverage: [
//         { name: "Hospital Stay", covered: true },
//         { name: "Dental", covered: false, note: "Not included in this plan" },
//         { name: "Prescription Drugs", covered: true },
//       ],
//     },
//     {
//       id: "7162860202005745682",
//       type: "primary",
//       plan_name: "Test Plan",
//       policy_number: "P987987",
//       group_number: "G9879879",
//       subscriber: {
//         last_name: "Jon",
//         first_name: "Sam",
//         middle_name: "Mike",
//         relationship: "spouse",
//         dob: "1988-02-09",
//         street: "Newjercy",
//         postal_code: "98698798",
//         city: "Kom",
//         state: "AL",
//         country: "USA",
//         phone: "986-987-9879",
//         employer: "Test S Empoyer",
//       },
//       user: {
//         first_name: "Ensoftek",
//         middle_name: "test",
//         last_name: "Admin",
//       },
//       insurance_company: {
//         name: "(Medicaid) AETNA",
//       },
//       facility: "A-AADO, 1111ADiamond1111 Facility",
//       copay: "10.00",
//       copay_notes: "",
//       effective_date: "2025-02-01",
//       termination_date: "2025-02-13",
//       policy_type: "",
//       deductible_amount: "9879",
//       deductible_met: "1000",
//       coinsurance: "2999",
//       notes: "test notes",
//     },
//   ];
// };

const getLabReportsDataFromApi = () => {
  return {
    id: 7162886270221752808,
    date_collected: "2024-12-25 12:07:00",
    date_ordered: "2024-12-25 12:07:00",
    procedure_name: "Urine Basic 6 with EtG",
    procedure_reports: [
      {
        id: 7162886270221752837,
        date_collected: "2024-12-25 12:07:00",
        date_report: "2024-12-25 15:03:00",
        report_status: "final",
        procedure_results: [
          {
            id: 7162886270221752838,
            result: "POSITIVE",
            range: "1000",
            abnormal: "",
            date: "2024-12-25 17:29:49",
            units: "ng/mL",
            comments:
              "{{Cordant Health Solutions - Tacoma Lab, 2617 E L St Ste A, Tacoma, WA 98421,\rCLIA # 50D0891660\r<br/><br/>\rValues listed in the reference/normal range indicate a laboratory reporting\rcutoff. There are no established ranges for a normal drug level in a patient's\rsystem.\r<br/><br/>\rTesting performed at Cordant Health Solutions - Tacoma Lab unless otherwise\rnotated in this report.\r<br/><br/>\rThese results were reviewed by or under the direct supervision of Irene Shu,\rPh.D., DABCC (CC,TC), F-ABFT .\r}}",
            result_status: "final",
            result_text: "Amphetamine Screen",
          },
          {
            id: 7162886270221752839,
            result: "NEGATIVE",
            range: "200",
            abnormal: "",
            date: "2024-04-08 17:29:49",
            units: "ng/mL",
            comments: "\r",
            result_status: "final",
            result_text: "Benzodiazepines Screen",
          },
          {
            id: 7162886270221752840,
            result: "NEGATIVE",
            range: "300",
            abnormal: "",
            date: "2024-12-25 17:29:49",
            units: "ng/mL",
            comments: "\r",
            result_status: "final",
            result_text: "Cocaine Screen",
          },
          {
            id: 7162886270221752841,
            result: "NEGATIVE",
            range: "500",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "ng/mL",
            comments: "\r",
            result_status: "final",
            result_text: "Ethyl glucuronide Screen",
          },
          {
            id: 7162886270221752842,
            result: "11",
            range: "500",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "mcg/mL",
            comments: "\rSpecimen Validity call: NORMAL\r",
            result_status: "final",
            result_text: "Nitrite",
          },
          {
            id: 7162886270221752843,
            result: "NEGATIVE",
            range: "300",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "ng/mL",
            comments: "\r",
            result_status: "final",
            result_text: "Opiates Screen",
          },
          {
            id: 7162886270221752844,
            result: "223.9",
            range: ">= 20 mg/dL",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "mg/dL",
            comments: "\r",
            result_status: "final",
            result_text: "Creatinine",
          },
          {
            id: 7162886270221752845,
            result: "5.3",
            range: "4.5 - 8.9",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "",
            comments: "\r",
            result_status: "final",
            result_text: "pH",
          },
          {
            id: 7162886270221752846,
            result: "NORMAL",
            range: ">= 20 mg/dL",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "",
            comments: "\r",
            result_status: "final",
            result_text: "CREATININE/SPECIFIC GRAVITY",
          },
          {
            id: 7162886270221752847,
            result: "NORMAL",
            range: "4.5 - 8.9",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "",
            comments: "\r",
            result_status: "final",
            result_text: "pH",
          },
          {
            id: 7162886270221752848,
            result: "NEGATIVE",
            range: "50",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "ng/mL",
            comments: "\r",
            result_status: "final",
            result_text: "Cannabinoids Screen",
          },
          {
            id: 7162886270221752849,
            result: "",
            range: "",
            abnormal: "",
            date: "2020-06-11 17:29:49",
            units: "ng/mg",
            comments: "\r",
            result_status: "final",
            result_text: "THC/Creatinine Ratio",
          },
          {
            id: 7162886270221752850,
            result: "",
            range: "",
            abnormal: "",
            date: "0000-00-00 00:00:00",
            units: "",
            comments: "\r",
            result_status: "",
            result_text: "PDF",
          },
        ],
      },
    ],
  };
};