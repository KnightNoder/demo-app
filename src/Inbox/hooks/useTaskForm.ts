import { useState, useCallback, useMemo } from 'react';
import { TaskFormData } from '../types/taskTypes';

const getInitialFormData = (initialState?: Partial<TaskFormData>): TaskFormData => ({
  recipients: initialState?.recipients || [],
  patientClient: initialState?.patientClient || "",
  progress: initialState?.progress || "",
  priority: initialState?.priority || "",
  startDate: initialState?.startDate || new Date().toISOString().split("T")[0],
  dueDate: initialState?.dueDate || new Date().toISOString().split("T")[0],
  subject: initialState?.subject || "",
  message: initialState?.message || "",
});

export const useTaskForm = (initialState?: Partial<TaskFormData>) => {
  const [formData, setFormData] = useState<TaskFormData>(() => getInitialFormData(initialState));

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
  }, []);

  const isFormValid = useMemo(() => {
    return (
      formData.subject.trim() &&
      formData.message.trim() &&
      formData.recipients.length > 0
    );
  }, [formData.subject, formData.message, formData.recipients.length]);

  const updateDefaults = useCallback((priority?: string, progress?: string, patientClient?: string, message?: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: prev.priority || priority || "",
      progress: prev.progress || progress || "",
      patientClient: prev.patientClient || patientClient || "",
      message: prev.message || message || "",
    }));
  }, []);

  return {
    formData,
    handleInputChange,
    resetForm,
    isFormValid,
    updateDefaults,
  };
};