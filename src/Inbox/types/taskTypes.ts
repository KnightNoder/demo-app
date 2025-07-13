export interface TaskFormData {
  recipients: string[];
  patientClient: string;
  progress: string;
  priority: string;
  startDate: string;
  dueDate: string;
  subject: string;
  message: string;
}

export interface User {
  id: number;
  name: string;
  type?: "staff" | "group";
  role?: string;
}

export interface OptionItem {
  option_id: string;
  title: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  showPriority?: boolean;
  showDates?: boolean;
  showSubject?: boolean;
  showStatus?: boolean;
  sendButtonText?: string;
  patientLabel?: string;
  modalTitle?: string;
  initialState?: {
    patientClient?: string;
    message?: string;
    progress?: string;
  };
}