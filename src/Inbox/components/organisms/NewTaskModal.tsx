import React, { useState, useEffect } from "react";
import Icons from "../../../Client-overview/assets/Icons/Icons";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
}

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


const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    recipients: [],
    patientClient: "",
    progress: "Not Started Yet",
    priority: "Medium",
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    subject: "",
    message: "",
  });

  const [startDateOption, setStartDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [dueDateOption, setDueDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [isRecipientsOpen, setIsRecipientsOpen] = useState(false);
  const [isPatientOpen, setIsPatientOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  // Mock data for dropdowns
  const staffOptions = [
    "Dr. Smith",
    "Nurse Johnson",
    "Dr. Williams",
    "Admin Assistant",
    "IT Support"
  ];

  const patientOptions = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Sarah Williams",
    "David Brown"
  ];

  const progressOptions = [
    "Not Started Yet",
    "In Progress",
    "On Hold",
    "Completed"
  ];

  const priorityOptions = [
    "Low",
    "Medium",
    "High",
    "Urgent"
  ];

  // Set dates based on option selection
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (startDateOption === "today") {
      setFormData(prev => ({ ...prev, startDate: today.toISOString().split('T')[0] }));
    } else if (startDateOption === "tomorrow") {
      setFormData(prev => ({ ...prev, startDate: tomorrow.toISOString().split('T')[0] }));
    }
  }, [startDateOption]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDateOption === "today") {
      setFormData(prev => ({ ...prev, dueDate: today.toISOString().split('T')[0] }));
    } else if (dueDateOption === "tomorrow") {
      setFormData(prev => ({ ...prev, dueDate: tomorrow.toISOString().split('T')[0] }));
    }
  }, [dueDateOption]);

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.subject.trim() || !formData.message.trim() || formData.recipients.length === 0) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  // Handle input changes
  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle recipient selection
  const toggleRecipient = (recipient: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(recipient)
        ? prev.recipients.filter(r => r !== recipient)
        : [...prev.recipients, recipient]
    }));
  };

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-labelledby="new-task-title"
        aria-describedby="new-task-description"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Screen reader only titles */}
        <h2 id="new-task-title" className="sr-only">New Task</h2>
        <p id="new-task-description" className="sr-only">Create a new task and optionally send a message to recipients</p>

        {/* Header */}
        <div className="px-4 py-2 rounded-t-xl">
          <h2 className="text-base font-semibold text-gray-900">New Task</h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          <div className="min-w-0 p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col w-full">
            
            {/* Recipients and Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recipients */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recipients/Assignees <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsRecipientsOpen(!isRecipientsOpen)}
                    className="flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-gray-50"
                    aria-haspopup="listbox"
                    aria-expanded={isRecipientsOpen}
                  >
                    <span className="flex items-center">
                      {formData.recipients.length > 0 ? (
                        <span className="text-gray-900">
                          {formData.recipients.length === 1 
                            ? formData.recipients[0]
                            : `${formData.recipients.length} selected`
                          }
                        </span>
                      ) : (
                        <span className="text-gray-500">Search staff or groups...</span>
                      )}
                    </span>
                    <svg className="h-4 w-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isRecipientsOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {staffOptions.map((staff) => (
                        <div
                          key={staff}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleRecipient(staff)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.recipients.includes(staff)}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          <span className="text-sm">{staff}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient/Client */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Link to Patient/Client <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsPatientOpen(!isPatientOpen)}
                    className="flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-gray-50"
                    aria-haspopup="listbox"
                    aria-expanded={isPatientOpen}
                  >
                    <span className="flex items-center">
                      {formData.patientClient ? (
                        <span className="text-gray-900">{formData.patientClient}</span>
                      ) : (
                        <span className="text-gray-500">Search patient or client...</span>
                      )}
                    </span>
                    <svg className="h-4 w-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isPatientOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {patientOptions.map((patient) => (
                        <div
                          key={patient}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleInputChange('patientClient', patient);
                            setIsPatientOpen(false);
                          }}
                        >
                          <span className="text-sm">{patient}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress, Priority, and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProgressOpen(!isProgressOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span>{formData.progress}</span>
                    <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProgressOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      {progressOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleInputChange('progress', option);
                            setIsProgressOpen(false);
                          }}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span>{formData.priority}</span>
                    <Icons variant="chevron-down" className="h-4 w-4 opacity-50" />
                  </button>
                  
                  {isPriorityOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      {priorityOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            handleInputChange('priority', option);
                            setIsPriorityOpen(false);
                          }}
                        >
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
                <div className="flex gap-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setStartDateOption("today")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      startDateOption === "today"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartDateOption("tomorrow")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      startDateOption === "tomorrow"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartDateOption("custom")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      startDateOption === "custom"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {startDateOption === "custom" ? (
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                  />
                ) : (
                  <div className="text-xs text-gray-600 mt-1">{formatDate(formData.startDate)}</div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
                <div className="flex gap-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setDueDateOption("today")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      dueDateOption === "today"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDueDateOption("tomorrow")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      dueDateOption === "tomorrow"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setDueDateOption("custom")}
                    className={`px-2 py-1 rounded-full border text-xs font-medium transition-colors ${
                      dueDateOption === "custom"
                        ? "bg-gray-200 border-gray-400 text-gray-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {dueDateOption === "custom" ? (
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                  />
                ) : (
                  <div className="text-xs text-gray-600 mt-1">{formatDate(formData.dueDate)}</div>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] disabled:cursor-not-allowed disabled:opacity-50 w-full"
                placeholder="Enter reminder subject"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="flex rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE] disabled:cursor-not-allowed disabled:opacity-50 w-full mt-2 min-h-[200px]"
                placeholder="Enter your task details here..."
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 py-2.5 px-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground py-2 px-3 h-9 font-normal border-gray-200 text-sm border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
          >
            Send
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Icons variant="close" className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

export default NewTaskModal;