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
import { sampleTasks } from "./data";

const Inbox = () => {
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
        cursor: pointer;
      }

      .ag-theme-custom .ag-header-cell:hover {
        background-color: oklch(0.961 0.013 264.5);
      }

      /* Fixed: Ensure sort icons are visible */
      .ag-theme-custom .ag-header-cell .ag-header-cell-text {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .ag-theme-custom .ag-icon {
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }

      .ag-theme-custom .ag-header-cell:hover .ag-icon {
        opacity: 1;
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

      {/* Fixed: Removed mx-10 constraint and updated grid layout */}
      <div className="w-full max-w-full px-4">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
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
      </div>

      {/* Fixed: Ensure TaskManagementContainer gets full width */}
      <div className="w-full bg-[#f4f5fb]">
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