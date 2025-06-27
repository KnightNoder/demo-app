import { User } from '../types/taskTypes';

export const MOCK_GROUPS: User[] = [
  { id: 101, name: "Cardiology Department", type: "group", role: "Department" },
  { id: 102, name: "Emergency Team", type: "group", role: "Team" },
  { id: 103, name: "Group A Patients", type: "group", role: "Patient Group" },
  { id: 104, name: "Anxiety Support Group", type: "group", role: "Patient Group" },
];

export const PATIENT_OPTIONS = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Sarah Williams",
  "David Brown",
];