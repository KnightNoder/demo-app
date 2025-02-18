import axiosClient from "./axiosClient";

interface InsuranceData {
  id: string;
  type: string;
  provider: string;
  plan: string;
  policyNumber: string;
  groupNumber: string;
  subscriberId: string;
  relationship: string;
  validity: string;
  contact: string;
  lastVerified: string;
  deductibleRemaining: string;
  outOfPocketRemaining: string;
  status: string;
  copays: {
    primaryCare: string;
    specialistVisit: string;
    urgentCare: string;
    emergencyRoom: string;
  };
  coverage: { name: string; covered: boolean; note?: string }[];
}

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
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // reject("lol"); // Resolve with the diagnosis data
  //     resolve(getDiagnosisData());
  //   }, 2000); // Simulate a 2-second delay
  // });
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
    const response = await axiosClient.get(`/medications/${patientId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clinical notes data:", error);
    throw error;
  }
};

export const getInsuranceDataFromApi = async (
  patientId: string | null
): Promise<InsuranceData[]> => {
  try {
    const response = await axiosClient.get(`/insurance-data?pid=${patientId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // reject("lol"); // Resolve with the diagnosis data
        resolve(getInsuranceData());
      }, 2000); // Simulate a 2-second delay
    });
    // return response.data;
  } catch (error) {
    console.error("Error fetching insurance data:", error);
    throw error;
  }
};

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

const getInsuranceData = () => {
  return [
    {
      id: "7160965258201788542",
      type: "primary",
      provider: "100265",
      plan: "RC-IDP",
      policyNumber: "Test123",
      groupNumber: "GRP123",
      subscriberId: "SUB123",
      relationship: "Self",
      validity: "2025-12-31",
      contact: "123-456-7890",
      lastVerified: "2024-01-01",
      deductibleRemaining: "$500",
      outOfPocketRemaining: "$1500",
      status: "Active",
      copays: {
        primaryCare: "$20",
        specialistVisit: "$40",
        urgentCare: "$50",
        emergencyRoom: "$150",
      },
      coverage: [
        { name: "Hospital Stay", covered: true },
        { name: "Dental", covered: false, note: "Not included in this plan" },
        { name: "Prescription Drugs", covered: true },
      ],
    },
  ];
};