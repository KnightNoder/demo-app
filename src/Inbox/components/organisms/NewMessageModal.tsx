import React from 'react';
import NewTaskModal from './NewTaskModal';
import { NewTaskModalProps } from '../../types/taskTypes';

export const NewMessageModal: React.FC<NewTaskModalProps> = (props) => {
  const { modalTitle, ...rest } = props;
  return (
    <NewTaskModal
      {...rest}
      showPriority={false}
      showDates={false}
      showSubject={false}
      showStatus={true}
      sendButtonText="Send Message"
      patientLabel="Person"
      modalTitle={modalTitle || "New Message"}
    />
  );
};