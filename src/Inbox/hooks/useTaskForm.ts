import { useState, useCallback, useMemo } from 'react';
import { TaskFormData } from '../types/taskTypes';

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

export const useTaskForm = () => {
  const [formData, setFormData] = useState<TaskFormData>(getInitialFormData);

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

  const updateDefaults = useCallback((priority?: string, progress?: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: prev.priority || priority || "",
      progress: prev.progress || progress || "",
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