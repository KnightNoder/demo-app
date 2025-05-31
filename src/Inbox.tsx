import { useEffect } from "react";
import {
  CheckIcon,
  ClockIcon,
  PlayIcon,
} from "./Inbox/components/assets/Icons";
import { Icon } from "./Inbox/components/atoms/Icon";
import { TaskCard } from "./Inbox/components/organisms/TaskCard";
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader";
import { TaskManagementContainer } from "./Inbox/components/organisms/TaskManagementContainer";

const Inbox = () => {
  const sampleTasks = [
    {
      id: "1",
      title: "Medication Review Due",
      description: "Monthly medication review required for patient John Smith",
      priority: "high" as const,
      dueDate: "Today",
      status: "pending" as const,
      assignedTo: "Dr. Sarah Wilson",
      person: "John Smith",
    },
    {
      id: "2",
      title: "Follow-up Appointment",
      description: "Schedule follow-up for post-surgery consultation",
      priority: "medium" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Nurse Johnson",
      person: "Emma Davis",
    },
    {
      id: "3",
      title: "Vaccination Due",
      description: "Annual flu vaccination reminder for elderly patient",
      priority: "medium" as const,
      dueDate: "2 days",
      status: "pending" as const,
      assignedTo: "Nurse Martinez",
      person: "George Brown",
    },
    {
      id: "4",
      title: "Lab Test Reminder",
      description: "Quarterly blood work due for diabetes monitoring",
      priority: "high" as const,
      dueDate: "3 days",
      status: "pending" as const,
      assignedTo: "Dr. Thompson",
      person: "Linda White",
    },
    {
      id: "5",
      title: "Physical Therapy Session",
      description: "Weekly PT session reminder for knee rehabilitation",
      priority: "medium" as const,
      dueDate: "Today",
      status: "in-progress" as const,
      assignedTo: "PT Staff",
      person: "Robert Johnson",
    },
    {
      id: "6",
      title: "Prescription Refill Due",
      description: "Blood pressure medication refill needed",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Garcia",
      person: "Mary Wilson",
    },
    {
      id: "7",
      title: "Annual Check-up Due",
      description: "Routine annual physical examination reminder",
      priority: "low" as const,
      dueDate: "4 days",
      status: "pending" as const,
      assignedTo: "Dr. Anderson",
      person: "James Taylor",
    },
    {
      id: "8",
      title: "Dental Cleaning Reminder",
      description: "Six-month dental cleaning and check-up",
      priority: "low" as const,
      dueDate: "5 days",
      status: "pending" as const,
      assignedTo: "Dental Staff",
      person: "Sarah Miller",
    },
    {
      id: "9",
      title: "Eye Examination Due",
      description: "Annual vision check and prescription update",
      priority: "medium" as const,
      dueDate: "6 days",
      status: "pending" as const,
      assignedTo: "Dr. Lee",
      person: "David Clark",
    },
    {
      id: "10",
      title: "Immunization Update",
      description: "Childhood vaccination schedule update needed",
      priority: "high" as const,
      dueDate: "7 days",
      status: "pending" as const,
      assignedTo: "Dr. Roberts",
      person: "Emily Young",
    },
    {
      id: "11",
      title: "Test",
      description: "Follow up on lab results from annual physical examination",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Wilson",
      person: "Bob Smith",
    },
    {
      id: "1",
      title: "Medication Review Due",
      description: "Monthly medication review required for patient John Smith",
      priority: "high" as const,
      dueDate: "Today",
      status: "pending" as const,
      assignedTo: "Dr. Sarah Wilson",
      person: "John Smith",
    },
    {
      id: "2",
      title: "Follow-up Appointment",
      description: "Schedule follow-up for post-surgery consultation",
      priority: "medium" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Nurse Johnson",
      person: "Emma Davis",
    },
    {
      id: "3",
      title: "Vaccination Due",
      description: "Annual flu vaccination reminder for elderly patient",
      priority: "medium" as const,
      dueDate: "2 days",
      status: "pending" as const,
      assignedTo: "Nurse Martinez",
      person: "George Brown",
    },
    {
      id: "4",
      title: "Lab Test Reminder",
      description: "Quarterly blood work due for diabetes monitoring",
      priority: "high" as const,
      dueDate: "3 days",
      status: "pending" as const,
      assignedTo: "Dr. Thompson",
      person: "Linda White",
    },
    {
      id: "5",
      title: "Physical Therapy Session",
      description: "Weekly PT session reminder for knee rehabilitation",
      priority: "medium" as const,
      dueDate: "Today",
      status: "in-progress" as const,
      assignedTo: "PT Staff",
      person: "Robert Johnson",
    },
    {
      id: "6",
      title: "Prescription Refill Due",
      description: "Blood pressure medication refill needed",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Garcia",
      person: "Mary Wilson",
    },
    {
      id: "7",
      title: "Annual Check-up Due",
      description: "Routine annual physical examination reminder",
      priority: "low" as const,
      dueDate: "4 days",
      status: "pending" as const,
      assignedTo: "Dr. Anderson",
      person: "James Taylor",
    },
    {
      id: "8",
      title: "Dental Cleaning Reminder",
      description: "Six-month dental cleaning and check-up",
      priority: "low" as const,
      dueDate: "5 days",
      status: "pending" as const,
      assignedTo: "Dental Staff",
      person: "Sarah Miller",
    },
    {
      id: "9",
      title: "Eye Examination Due",
      description: "Annual vision check and prescription update",
      priority: "medium" as const,
      dueDate: "6 days",
      status: "pending" as const,
      assignedTo: "Dr. Lee",
      person: "David Clark",
    },
    {
      id: "10",
      title: "Immunization Update",
      description: "Childhood vaccination schedule update needed",
      priority: "high" as const,
      dueDate: "7 days",
      status: "pending" as const,
      assignedTo: "Dr. Roberts",
      person: "Emily Young",
    },
    {
      id: "11",
      title: "Test",
      description: "Follow up on lab results from annual physical examination",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Wilson",
      person: "Bob Smith",
    },
    {
      id: "1",
      title: "Medication Review Due",
      description: "Monthly medication review required for patient John Smith",
      priority: "high" as const,
      dueDate: "Today",
      status: "pending" as const,
      assignedTo: "Dr. Sarah Wilson",
      person: "John Smith",
    },
    {
      id: "2",
      title: "Follow-up Appointment",
      description: "Schedule follow-up for post-surgery consultation",
      priority: "medium" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Nurse Johnson",
      person: "Emma Davis",
    },
    {
      id: "3",
      title: "Vaccination Due",
      description: "Annual flu vaccination reminder for elderly patient",
      priority: "medium" as const,
      dueDate: "2 days",
      status: "pending" as const,
      assignedTo: "Nurse Martinez",
      person: "George Brown",
    },
    {
      id: "4",
      title: "Lab Test Reminder",
      description: "Quarterly blood work due for diabetes monitoring",
      priority: "high" as const,
      dueDate: "3 days",
      status: "pending" as const,
      assignedTo: "Dr. Thompson",
      person: "Linda White",
    },
    {
      id: "5",
      title: "Physical Therapy Session",
      description: "Weekly PT session reminder for knee rehabilitation",
      priority: "medium" as const,
      dueDate: "Today",
      status: "in-progress" as const,
      assignedTo: "PT Staff",
      person: "Robert Johnson",
    },
    {
      id: "6",
      title: "Prescription Refill Due",
      description: "Blood pressure medication refill needed",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Garcia",
      person: "Mary Wilson",
    },
    {
      id: "7",
      title: "Annual Check-up Due",
      description: "Routine annual physical examination reminder",
      priority: "low" as const,
      dueDate: "4 days",
      status: "pending" as const,
      assignedTo: "Dr. Anderson",
      person: "James Taylor",
    },
    {
      id: "8",
      title: "Dental Cleaning Reminder",
      description: "Six-month dental cleaning and check-up",
      priority: "low" as const,
      dueDate: "5 days",
      status: "pending" as const,
      assignedTo: "Dental Staff",
      person: "Sarah Miller",
    },
    {
      id: "9",
      title: "Eye Examination Due",
      description: "Annual vision check and prescription update",
      priority: "medium" as const,
      dueDate: "6 days",
      status: "pending" as const,
      assignedTo: "Dr. Lee",
      person: "David Clark",
    },
    {
      id: "10",
      title: "Immunization Update",
      description: "Childhood vaccination schedule update needed",
      priority: "high" as const,
      dueDate: "7 days",
      status: "pending" as const,
      assignedTo: "Dr. Roberts",
      person: "Emily Young",
    },
    {
      id: "11",
      title: "Test",
      description: "Follow up on lab results from annual physical examination",
      priority: "high" as const,
      dueDate: "Tomorrow",
      status: "pending" as const,
      assignedTo: "Dr. Wilson",
      person: "Bob Smith",
    },
  ];

  const handleCardClick = (cardType: string) => {
    console.log(`${cardType} card clicked`);
  };

  const handleNewTask = () => {
    console.log("New task clicked");
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  const handleSort = () => {
    console.log("Sort clicked");
  };

  const handleReply = (taskId: string) => {
    console.log("Reply to task:", taskId);
  };

  const handleComplete = (taskId: string) => {
    console.log("Complete task:", taskId);
  };

  // Inject CSS styles
  useEffect(() => {
    const styleId = "inbox-custom-styles";

    // Remove existing styles
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new styles
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* AG Grid Custom Theme */
      .ag-theme-custom {
        --ag-header-height: 41px;
        --ag-row-height: 48px;
        --ag-font-family: inherit;
        --ag-font-size: 14px;
        --ag-border-color: oklch(0.898 0.013 264.5);
        --ag-header-background-color: oklch(0.976 0.013 264.5);
        --ag-odd-row-background-color: oklch(1 0 0);
        --ag-even-row-background-color: oklch(1 0 0);
        --ag-row-hover-color: oklch(0.961 0.013 264.5);
        --ag-selected-row-background-color: oklch(0.961 0.026 264.5);
      }

      .ag-theme-custom .ag-header-cell {
        border-right: 1px solid var(--ag-border-color);
        transition: background-color 0.2s ease;
      }

      .ag-theme-custom .ag-header-cell:hover {
        background-color: oklch(0.961 0.013 264.5);
      }

      .ag-theme-custom .ag-cell {
        border-right: 1px solid var(--ag-border-color);
        display: flex;
        align-items: center;
        transition: all 0.2s ease;
      }

      .ag-theme-custom .ag-row {
        border-bottom: 1px solid var(--ag-border-color);
        transition: all 0.2s ease;
      }

      .ag-theme-custom .ag-row:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px oklch(0.898 0.013 264.5 / 0.15);
      }

      .ag-theme-custom .ag-header {
        border-bottom: 1px solid var(--ag-border-color);
      }

      .ag-theme-custom .ag-paging-panel {
        border-top: 1px solid var(--ag-border-color);
        background-color: oklch(0.976 0.013 264.5);
      }

      /* Utility Classes */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .scrollbar-none {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .scrollbar-none::-webkit-scrollbar {
        display: none;
      }

      /* Size utilities for Tailwind 4 */
      .size-3 {
        width: 0.75rem;
        height: 0.75rem;
      }

      .size-3\\.5 {
        width: 0.875rem;
        height: 0.875rem;
      }

      .size-4 {
        width: 1rem;
        height: 1rem;
      }

      .size-5 {
        width: 1.25rem;
        height: 1.25rem;
      }

      .size-6 {
        width: 1.5rem;
        height: 1.5rem;
      }

      /* Animations */
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scale-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }

      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }

      .animate-scale-in {
        animation: scale-in 0.2s ease-out;
      }

      /* Hover scale utilities */
      .hover\\:scale-102:hover {
        transform: scale(1.02);
      }

      .hover\\:scale-105:hover {
        transform: scale(1.05);
      }

      .hover\\:scale-110:hover {
        transform: scale(1.1);
      }

      /* Focus and transition improvements */
      .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      .duration-200 {
        transition-duration: 200ms;
      }

      .duration-300 {
        transition-duration: 300ms;
      }

      .ease-in-out {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Modern underline styling */
      .decoration-2 {
        text-decoration-thickness: 2px;
      }

      .underline-offset-2 {
        text-underline-offset: 2px;
      }
    `;

    document.head.appendChild(style);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#f4f5fb] text-[#020817]">
      <TaskHeader
        onNewTask={handleNewTask}
        onFilter={handleFilter}
        onSort={handleSort}
      />

      <div className="min-h-screen w-full max-w-7xl mx-10">
        <div className="grid gap- grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <TaskCard
            title="Birthdays"
            count={9}
            icon={<PlayIcon />}
            onClick={() => handleCardClick("Urgent Tasks")}
            variant="urgent"
          />

          <TaskCard
            title="Review Forms"
            count={8}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Forms")}
            variant="normal"
          />

          <TaskCard
            title="Review Prescriptions"
            count={7}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Prescriptions")}
            variant="normal"
          />

          <TaskCard
            title="Pending Too Long"
            count={2}
            icon={
              <Icon size="md">
                <CheckIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Pending Too Long")}
            variant="normal"
          />

          <TaskCard
            title="Treatment Reviews"
            count={0}
            icon={<ClockIcon />}
            onClick={() => handleCardClick("Treatment Reviews")}
            variant="normal"
          />
        </div>
        <TaskManagementContainer
          tasks={sampleTasks}
          onReply={handleReply}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default Inbox;
