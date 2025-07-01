import React, { useState } from "react";
import { AGGridTable } from "./AGGridTable";
import { ExtendedTask, ApiColumn } from "./TaskManagementContainer";

interface MessagesListProps {
  messages: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  panelWidth?: number;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  columns,
  onReply,
  onComplete,
  panelWidth = 1200,
}) => {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [searchValue, setSearchValue] = useState("");
  const [showFilter, setShowFilter] = useState<"all" | "my">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");

  // Filter tasks based on search and filters
  const filteredTasks = messages.filter(task => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.assignedTo?.toLowerCase().includes(searchLower) ||
      task.person?.toLowerCase().includes(searchLower);

    // Filter by tab (inbox/sent) - using 'messageType' property on ExtendedTask
    const matchesTab =
      activeTab === "inbox"
        ? task.messageType !== "sent" // Assuming 'sent' is a possible messageType
        : task.messageType === "sent";

    // Filter by 'Show' (all/my) - assuming 'my' messages are identified by 'from'
    // NOTE: Replace "CURRENT_USER_IDENTIFIER" with the actual user's ID or name
    // This value would typically come from an authentication context or user profile.
    const matchesShow =
      showFilter === "all" || (showFilter === "my" && task.from === "CURRENT_USER_IDENTIFIER");

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && task.messageStatus === "unread") ||
      (statusFilter === "read" && task.messageStatus === "read");

    return matchesSearch && matchesTab && matchesShow && matchesStatus;
  });

  // Calculate counts for tabs based on messageType
  const inboxCount = messages.filter(task => task.messageType !== "sent").length;
  const sentCount = messages.filter(task => task.messageType === "sent").length;

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="h-full p-4">
        {/* Tab Navigation */}
        <div className="mb-4 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === "inbox"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Inbox
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {inboxCount}
              </span>
            </button>
            {/* The 'Sent' tab is included for future expansion. Currently, the API only provides inbox messages,
                so this tab will likely show 0 messages unless your API is updated to include 'sent' messages
                with a 'messageType' of "sent". */}
            <button
              onClick={() => setActiveTab("sent")}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === "sent"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sent
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {sentCount}
              </span>
            </button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="mb-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                placeholder="Search by message, person, or notes..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* Show Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => setShowFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    showFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Messages
                </button>
                <button
                  onClick={() => setShowFilter("my")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    showFilter === "my"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  My Messages
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("unread")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === "unread"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setStatusFilter("read")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === "read"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="ag-theme-alpine ag-theme-custom rounded-lg border border-gray-200">
          <AGGridTable
            tasks={filteredTasks}
            columns={columns}
            onReply={onReply}
            onComplete={onComplete}
            activeTab="messages"
            isPanelReady={true}
            panelWidth={panelWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesList;