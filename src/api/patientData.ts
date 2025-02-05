// import axiosClient from "./axiosClient";

export const getAllergyDataFromApi = async () => {
  // const response = await axiosClient.get("/allergies");
  // return response.data;
  return [
    {
      id: "7162860202000553277",
      type: "allergy",
      allergen: "Peanuts",
      title: "ICD10:G30.0(Alzheimer's disease with early onset)",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
      diagnosis: "ICD10:G30.0",
      reaction: "test Reaction",
      severity: "255604002",
    },
    {
      id: "7162860202000553295",
      allergen: "Pencillin",
      type: "allergy",
      title:
        "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
      diagnosis: "ICD10:T84.81XD",
      reaction: "test Reaction",
      severity: "255604002",
    },
    {
      id: "7162860202000553277",
      type: "allergy",
      allergen: "Peanuts",
      title: "ICD10:G30.0(Alzheimer's disease with early onset)",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
      diagnosis: "ICD10:G30.0",
      reaction: "test Reaction",
      severity: "255604002",
    },
    {
      id: "7162860202000553295",
      allergen: "Pencillin",
      type: "allergy",
      title:
        "ICD10:T84.81XD(Embolism due to internal orthopedic prosthetic devices, implants and grafts, subsequent encounter)",
      begdate: "2025-01-01 17:49:01",
      enddate: "2025-01-31 17:49:04",
      diagnosis: "ICD10:T84.81XD",
      reaction: "test Reaction",
      severity: "255604002",
    },
  ];
};

export const getDiagnosisDataFromApi = async () => {
  // const response =
  // await fetch(
  //   "http://qa-phoenix.drcloudemr.com/drcloud/public/api/medical-problems"
  // );
  // await axiosClient.get("/medical_problems");
  // return response.data;
  return [
    {
      id: "7162860202000553509",
      type: "medical_problem",
      title:
        "ICD10:R50.81(Fever presenting with conditions classified elsewhere)",
      begdate: "2025-01-01 10:57:02",
      enddate: "",
      diagnosis: "ICD10:R50.81",
      user: "admin",
    },
    {
      id: "7162860202000553515",
      type: "medical_problem",
      title:
        "ICD10:R50.81(Fever presenting with conditions classified elsewhere)",
      begdate: "2025-01-01",
      enddate: "",
      diagnosis: "ICD10:R50.81",
      user: "admin",
    },
  ];
};
