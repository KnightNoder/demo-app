// GridItem interface for DnD functionality
export interface GridItem {
  id: string;
  order: number;
}

// Modal information interface
export interface ModalInfo {
  isOpen: boolean;
  url: string;
  title: string;
}

// JWT token structure
export interface DecodedToken {
  sub: string;
  username?: string;
  name?: string;
  email?: string;
  exp: number;
  iat: number;
  [key: string]: any; // For other possible claims
}

// Card action handler type
export type CardActionHandler = (
  action: string,
  category: string | null
) => void;

export type BirthdayData = {
  pid: number;
  name: string;
  DOB: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  phone_home: string;
  loc: string | null;
  room: string | null;
};

export type BirthdayApiResponse = {
  columns: ApiColumn[];
  data: BirthdayData[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
};

type ApiColumn = {
  key: string;
  label: string;
};

// ADD: If these interfaces don't exist in your types file
export interface AgendaData {
  pc_eid: number;
  pc_eventDate: string;
  formatted_start_time: string;
  formatted_end_time: string;
  appointment_type: string;
  recurrence_type: string;
  patient_name: string;
  provider: string;
  category: string;
  facility: string;
}

export interface AgendaApiResponse {
  columns: ApiColumn[];
  data: AgendaData[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}