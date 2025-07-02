import React, { useEffect, useCallback, useMemo, memo } from "react";
import { ModalTemplate } from "./Modal";
import { RecipientsSelector } from "../organisms/RecepientSelector";
import { SimpleDropdown } from "../organisms/SimpleDropdown";
import { DateSelector } from "../organisms/DateSelector";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { TextArea } from "../atoms/TextArea";
import { Button } from "../atoms/Button";
import { useTaskForm } from "../../hooks/useTaskForm";
import { useTaskOptions } from "../../hooks/useTaskOptions";
import { useTaskUsers } from "../../hooks/useTaskUsers";
import { usePatients } from "../../hooks/usePatients";
import { useGroups } from "../../hooks/useGroups";
import { NewTaskModalProps } from "../../types/taskTypes";
import ErrorRetryDisplay from "../molecules/ErrorRetryDisplay";

const NewTaskModal: React.FC<NewTaskModalProps> = memo(({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { formData, handleInputChange, resetForm, isFormValid, updateDefaults } = useTaskForm();
  const { users, usersLoading, usersError, fetchUsers } = useTaskUsers();
  const { patients, patientsLoading, patientsError, fetchPatients } = usePatients();
  const { groups, groupsLoading, groupsError, fetchGroups } = useGroups();
  const { priorityOptions, progressOptions, optionsLoading, optionsError, fetchOptions } = useTaskOptions();

  const handleSubmit = useCallback(() => {
    if (!isFormValid) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onClose();
  }, [isFormValid, formData, onSubmit, onClose]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      
      const loadData = async () => {
        const [, optionsResult] = await Promise.all([
          fetchUsers(),
          fetchOptions(),
          fetchPatients(),
          fetchGroups(),
        ]);
        
        if (optionsResult) {
          updateDefaults(optionsResult.priorities[1], optionsResult.progress[0]);
        }
      };
      
      loadData();
    }
  }, [isOpen, fetchUsers, fetchOptions, fetchPatients, fetchGroups, resetForm, updateDefaults]);

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
          groups={groups.map(g => ({ ...g, type: 'group', role: 'group' }))}
          loading={usersLoading || groupsLoading}
          error={usersError || groupsError}
          onRetry={usersError ? fetchUsers : fetchGroups}
        />

        <SimpleDropdown
          label="Link to Patient/Client"
          value={formData.patientClient}
          options={patients.map(p => p.name)}
          onChange={(value) => handleInputChange("patientClient", value)}
          placeholder="Search patient or client..."
          disabled={patientsLoading}
        />
        {patientsError && <ErrorRetryDisplay error={patientsError} onRetry={fetchPatients} />}
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

      <ErrorRetryDisplay error={optionsError} onRetry={fetchOptions} />

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
});

NewTaskModal.displayName = 'NewTaskModal';

export default NewTaskModal;
