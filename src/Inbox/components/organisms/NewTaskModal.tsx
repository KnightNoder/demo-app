import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ModalTemplate } from "./Modal";
import { RecipientsSelector } from "../organisms/RecepientSelector";
import { SimpleDropdown } from "../organisms/SimpleDropdown";
import { DateSelector } from "../organisms/DateSelector";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { TextArea } from "../atoms/TextArea";
import { Button } from "../atoms/Button";
import axiosClient from "../../../api/axiosClient";

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

interface User {
  id: number;
  name: string;
  type?: "staff" | "group";
  role?: string;
}

interface OptionItem {
  option_id: string;
  title: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
}

// Constants moved outside component to prevent recreation
const MOCK_GROUPS: User[] = [
  { id: 101, name: "Cardiology Department", type: "group", role: "Department" },
  { id: 102, name: "Emergency Team", type: "group", role: "Team" },
  { id: 103, name: "Group A Patients", type: "group", role: "Patient Group" },
  {
    id: 104,
    name: "Anxiety Support Group",
    type: "group",
    role: "Patient Group",
  },
];

const PATIENT_OPTIONS = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Sarah Williams",
  "David Brown",
];

const FALLBACK_USERS: User[] = [
  { id: 1, name: "Dr. Sarah Johnson", type: "staff", role: "Physician" },
  { id: 2, name: "Dr. Michael Chen", type: "staff", role: "Surgeon" },
  {
    id: 3,
    name: "Nurse Rebecca Adams",
    type: "staff",
    role: "Registered Nurse",
  },
  { id: 4, name: "Admin Assistant", type: "staff", role: "Administrative" },
  { id: 5, name: "IT Support", type: "staff", role: "Technical" },
];

const FALLBACK_OPTIONS = {
  priority: ["High", "Medium", "Low"],
  progress: ["Not Started Yet", "In Progress", "On Hold", "Completed"],
};

const getInitialFormData = (): TaskFormData => ({
  recipients: [],
  patientClient: "",
  progress: "",
  priority: "",
  startDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
  subject: "",
  message: "",
});

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TaskFormData>(getInitialFormData);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Options state
  const [priorityOptions, setPriorityOptions] = useState<string[]>([]);
  const [progressOptions, setProgressOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // Memoized validation
  const isFormValid = useMemo(() => {
    return (
      formData.subject.trim() &&
      formData.message.trim() &&
      formData.recipients.length > 0
    );
  }, [formData.subject, formData.message, formData.recipients.length]);

  // Memoized handlers
  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!isFormValid) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onClose();
  }, [isFormValid, formData, onSubmit, onClose]);

  // API functions
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);

      const response = await axiosClient.get<ApiResponse<User[]>>("/users");

      if (response.data.success) {
        const usersWithType = response.data.data.map((user) => ({
          ...user,
          type: "staff" as const,
          role: "Staff",
        }));
        setUsers(usersWithType);
      } else {
        throw new Error("Failed to load users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsersError("Failed to load users");
      setUsers(FALLBACK_USERS);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      setOptionsLoading(true);
      setOptionsError(null);

      const [priorityResponse, progressResponse] = await Promise.all([
        axiosClient.get<ApiResponse<OptionItem[]>>(
          "/list-options/priority_levels"
        ),
        axiosClient.get<ApiResponse<OptionItem[]>>(
          "/list-options/task_progress"
        ),
      ]);

      let priorities: string[] = [];
      let progress: string[] = [];

      if (priorityResponse.data.success) {
        priorities = priorityResponse.data.data.map((item) => item.title);
        setPriorityOptions(priorities);
      } else {
        throw new Error("Failed to load priority options");
      }

      if (progressResponse.data.success) {
        progress = progressResponse.data.data.map((item) => item.title);
        setProgressOptions(progress);
      } else {
        throw new Error("Failed to load progress options");
      }

      // Set defaults after successful fetch
      setFormData((prev) => ({
        ...prev,
        priority: prev.priority || priorities[0] || "",
        progress: prev.progress || progress[0] || "",
      }));
    } catch (err) {
      console.error("Failed to fetch options:", err);
      setOptionsError("Failed to load options");

      // Use fallback options
      setPriorityOptions(FALLBACK_OPTIONS.priority);
      setProgressOptions(FALLBACK_OPTIONS.progress);

      setFormData((prev) => ({
        ...prev,
        priority: prev.priority || FALLBACK_OPTIONS.priority[1], // Default to Medium
        progress: prev.progress || FALLBACK_OPTIONS.progress[0], // Default to Not Started Yet
      }));
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      fetchUsers();
      fetchOptions();
    }
  }, [isOpen, fetchUsers, fetchOptions]);

  // Memoized footer to prevent unnecessary re-renders
  const footer = useMemo(
    () => (
      <>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Send
        </Button>
      </>
    ),
    [onClose, handleSubmit, isFormValid]
  );

  // Memoized error display
  const errorDisplay = useMemo(() => {
    if (!optionsError) return null;

    return (
      <div className="text-red-600 text-sm mb-2">
        {optionsError}
        <button
          onClick={fetchOptions}
          className="ml-2 text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }, [optionsError, fetchOptions]);

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title="New Task"
      footer={footer}
    >
      {/* Recipients and Patient Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecipientsSelector
          selectedRecipients={formData.recipients}
          onRecipientsChange={(recipients) =>
            handleInputChange("recipients", recipients)
          }
          users={users}
          groups={MOCK_GROUPS}
          loading={usersLoading}
          error={usersError}
          onRetry={fetchUsers}
        />

        <SimpleDropdown
          label="Link to Patient/Client"
          value={formData.patientClient}
          options={PATIENT_OPTIONS}
          onChange={(value) => handleInputChange("patientClient", value)}
          placeholder="Search patient or client..."
        />
      </div>

      {/* Progress, Priority, and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleDropdown
          label="Progress"
          value={formData.progress}
          options={progressOptions}
          onChange={(value) => handleInputChange("progress", value)}
          disabled={optionsLoading}
        />

        <SimpleDropdown
          label="Priority"
          value={formData.priority}
          options={priorityOptions}
          onChange={(value) => handleInputChange("priority", value)}
          disabled={optionsLoading}
        />

        <DateSelector
          label="Start Date"
          value={formData.startDate}
          onChange={(value) => handleInputChange("startDate", value)}
        />

        <DateSelector
          label="Due Date"
          value={formData.dueDate}
          onChange={(value) => handleInputChange("dueDate", value)}
        />
      </div>

      {/* Error display for options */}
      {errorDisplay}

      {/* Subject */}
      <FormField label="Subject" required id="subject">
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          placeholder="Enter reminder subject"
        />
      </FormField>

      {/* Message */}
      <FormField label="Message" required id="message">
        <TextArea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          placeholder="Enter your task details here..."
          className="min-h-[200px]"
        />
      </FormField>
    </ModalTemplate>
  );
};

export default NewTaskModal;
