import React, { useState, useEffect, useMemo } from "react";
import { AGGridTable } from "./AGGridTable";
import { ExtendedTask, ApiColumn } from "./TaskManagementContainer";
import { InboxService } from "../../services/inboxService";

interface MessagesListProps {
  messages: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  panelWidth?: number;
  onMessageCountChange?: (count: number) => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages: inboxMessagesProp, // Rename to avoid conflict with internal state
  columns,
  onReply,
  onComplete,
  panelWidth = 1200,
  onMessageCountChange,
}) => {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [searchValue, setSearchValue] = useState("");
  const [showFilter, setShowFilter] = useState<"all" | "my">("my"); // Default to "my" since initial data is from fetchMyMessages
  const [allMessagesData, setAllMessagesData] = useState<ExtendedTask[]>([]);
  const [myMessagesData, setMyMessagesData] = useState<ExtendedTask[]>([]);
  const [currentColumns, setCurrentColumns] = useState<ApiColumn[]>(columns);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">(
    "all"
  );
  const [sentMessages, setSentMessages] = useState<ExtendedTask[]>([]);
  const [loadingSent, setLoadingSent] = useState(false);

  // Helper function to fetch all messages
  const fetchAllMessages = async () => {
    try {
      const response = await InboxService.fetchMessages();

      // Check if response.data is an array or has a data property
      const messagesArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      if (!messagesArray || !Array.isArray(messagesArray)) {
        setAllMessagesData([]);
        return [];
      }

      // Transform the API response to match ExtendedTask format
      const transformedMessages = messagesArray.map((message: any) => ({
        id: message.id.toString(),
        title: `${message.type}: ${message.patient}`,
        description:
          message.body ||
          `Message from ${message.from} regarding ${message.patient}`,
        assignedTo: message.from,
        person: message.patient,
        dueDate: message.date,
        priority: "medium" as const,
        status:
          message.status === "Done" || message.status === "Read"
            ? ("completed" as const)
            : ("pending" as const),
        type: message.type,
        from: message.from,
        patient: message.patient,
        messageType: message.type,
        date: message.date,
        messageStatus:
          message.status === "Done" || message.status === "Read"
            ? "read"
            : "unread",
        originalStatus: message.status,
        form_link: message.form_link,
        body: message.body, // Include the body field directly
        content: message.body, // Also map to content for column display
      }));
      setAllMessagesData(transformedMessages);

      // Update columns from API response
      if (response.columns) {
        let messageColumns: ApiColumn[] = response.columns;

        // Update column mappings for messages
        messageColumns = messageColumns.map((column) => {
          if (column.key === "status") {
            return { ...column, key: "messageStatus" };
          }
          // Change any column with "Content" label to "Message"
          if (column.label && column.label.toLowerCase().includes('content')) {
            return { ...column, label: 'Message' };
          }
          return column;
        });

        // Remove the "Messages" column
        messageColumns = messageColumns.filter(
          (column) => column.key !== "messages"
        );

        // Add the "Actions" column
        messageColumns.push({
          key: "actions",
          label: "Actions",
          cellRenderer: () =>
            `<div class="flex justify-end gap-2">
              <button class="text-gray-400 hover:text-amber-600 p-2 rounded-sm hover:bg-amber-50" title="Mark as Client Grievance">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-warning h-6 w-6 text-amber-500 hover:text-amber-600">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </button>
              <button class="text-gray-400 hover:text-blue-600 p-2 rounded-sm hover:bg-blue-50" title="Mark as read">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-6 w-6 text-blue-500 hover:text-blue-600">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>`,
        });

        setCurrentColumns(messageColumns);
      }

      return transformedMessages;
    } catch {
      setAllMessagesData([]);
      return [];
    }
  };

  // Helper function to fetch my messages
  const fetchMyMessages = async () => {
    try {
      const response = await InboxService.fetchMyMessages();

      // Check if response.data is an array or has a data property
      const messagesArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      if (!messagesArray || !Array.isArray(messagesArray)) {
        setMyMessagesData([]);
        return [];
      }

      // Transform the API response to match ExtendedTask format
      const transformedMessages = messagesArray.map((message: any) => ({
        id: message.id.toString(),
        title: `${message.type}: ${message.patient}`,
        description:
          message.body ||
          `Message from ${message.from} regarding ${message.patient}`,
        assignedTo: message.from,
        person: message.patient,
        dueDate: message.date,
        priority: "medium" as const,
        status:
          message.status === "Done" || message.status === "Read"
            ? ("completed" as const)
            : ("pending" as const),
        type: message.type,
        from: message.from,
        patient: message.patient,
        messageType: message.type,
        date: message.date,
        messageStatus:
          message.status === "Done" || message.status === "Read"
            ? "read"
            : "unread",
        originalStatus: message.status,
        form_link: message.form_link,
        body: message.body, // Include the body field directly
        content: message.body, // Also map to content for column display
      }));
      setMyMessagesData(transformedMessages);

      // Update columns from API response
      if (response.columns) {
        let messageColumns: ApiColumn[] = response.columns;

        // Update column mappings for messages
        messageColumns = messageColumns.map((column) => {
          if (column.key === "status") {
            return { ...column, key: "messageStatus" };
          }
          // Change any column with "Content" label to "Message"
          if (column.label && column.label.toLowerCase().includes('content')) {
            return { ...column, label: 'Message' };
          }
          return column;
        });

        // Remove the "Messages" column
        messageColumns = messageColumns.filter(
          (column) => column.key !== "messages"
        );

        // Add the "Actions" column
        messageColumns.push({
          key: "actions",
          label: "Actions",
          cellRenderer: () =>
            `<div class="flex justify-end gap-2">
              <button class="text-gray-400 hover:text-amber-600 p-2 rounded-sm hover:bg-amber-50" title="Mark as Client Grievance">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-warning h-6 w-6 text-amber-500 hover:text-amber-600">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </button>
              <button class="text-gray-400 hover:text-blue-600 p-2 rounded-sm hover:bg-blue-50" title="Mark as read">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-6 w-6 text-blue-500 hover:text-blue-600">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>`,
        });

        setCurrentColumns(messageColumns);
      }

      return transformedMessages;
    } catch {
      setMyMessagesData([]);
      return [];
    }
  };

  // Initialize with passed messages data if available, otherwise fetch data
  useEffect(() => {
    console.log("MessagesList: Received messages prop:", inboxMessagesProp);
    console.log("MessagesList: Received columns prop:", columns);

    if (inboxMessagesProp && inboxMessagesProp.length > 0) {
      // The passed data is from fetchMessagesDataForPanel which calls "My Messages" API
      // So we set it as myMessagesData and set filter to "my"
      setMyMessagesData(inboxMessagesProp);
      console.log("MessagesList: Using passed messages data as My Messages");

      // Update columns with passed columns
      if (columns && columns.length > 0) {
        setCurrentColumns(columns);
        console.log("MessagesList: Using passed columns");
      }
    } else {
      // Only fetch if no messages were passed
      console.log(
        "MessagesList: No messages passed, fetching My Messages data"
      );
      fetchMyMessages();
    }
  }, [inboxMessagesProp, columns]);

  // Effect to handle filter changes - only when user explicitly changes filter
  // Note: This won't run on initial load since we handle that in the first useEffect

  // Effect to fetch sent messages when the tab changes to 'sent'
  useEffect(() => {
    if (activeTab === "sent") {
      setLoadingSent(true);
      InboxService.fetchSentMessages()
        .then((response) => {
          console.log("Sent messages API response:", response);

          // Check if response.data is an array or has a data property
          const messagesArray = Array.isArray(response.data)
            ? response.data
            : response.data?.data;

          if (!messagesArray || !Array.isArray(messagesArray)) {
            setSentMessages([]);
            return;
          }

          // Transform sent messages to match ExtendedTask format
          const transformedMessages = messagesArray.map((message: any) => ({
            id: message.id.toString(),
            title: `${message.type}: ${message.patient || "No Patient"}`,
            description:
              message.body ||
              `Message to ${message.to} regarding ${message.patient || "General"}`,
            assignedTo: message.to, // For sent messages, this is who we sent it to
            person: message.patient || message.to, // Use patient if available, otherwise the recipient
            dueDate: message.date,
            priority: "medium" as const,
            status: "completed" as const, // Sent messages are considered completed
            type: message.type,
            to: message.to, // Use 'to' field for sent messages
            patient: message.to,
            messageType: message.type,
            date: message.date,
            messageStatus: "read", // Sent messages are always "sent/read"
            originalStatus: "Sent",
            form_link: null,
            body: message.body,
            content: message.body,
          }));

          console.log("Transformed sent messages:", transformedMessages);
          setSentMessages(transformedMessages);

          // Update columns for sent messages if provided
          if (response.data.columns) {
            let messageColumns: ApiColumn[] = response.data.columns;

            // Remove the "from" column for sent messages since they use "to"
            messageColumns = messageColumns.filter(
              (column) => column.key !== "from"
            );

            // Map person column to show "to" field for sent messages
            messageColumns = messageColumns.map((column) => {
              if (column.key === "person" || column.key === "patient") {
                return { ...column, key: "to" };
              }
              return column;
            });

            // Add the "Actions" column for sent messages too
            messageColumns.push({
              key: "actions",
              label: "Actions",
              cellRenderer: () =>
                `<div class="flex justify-end gap-2">
                  <button class="text-gray-400 hover:text-blue-600 p-2 rounded-sm hover:bg-blue-50" title="View Sent Message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-6 w-6 text-blue-500 hover:text-blue-600">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>`,
            });

            setCurrentColumns(messageColumns);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch sent messages:", error);
          setSentMessages([]); // Clear messages on error
        })
        .finally(() => {
          setLoadingSent(false);
        });
    }
  }, [activeTab]);

  const currentMessages =
    activeTab === "inbox"
      ? showFilter === "all"
        ? allMessagesData
        : myMessagesData
      : sentMessages;

  // Filter and reorder columns based on active tab
  const filteredColumns = useMemo(() => {
    let columns = [...currentColumns];
    
    if (activeTab === "sent") {
      // For sent messages, remove "from" column and ensure proper column mapping
      columns = columns.filter(column => column.key !== "from");
      
      // Map person/patient columns to "to" for sent messages
      columns = columns.map(column => {
        if (column.key === "person" || column.key === "patient") {
          return { ...column, key: "to", label: column.label === "Person" ? "To" : column.label };
        }
        return column;
      });
    } else if (activeTab === "inbox") {
      // For inbox messages, reorder columns: Content, From, Person, Type, Date, Status, Actions
      const columnOrder = ["content", "body", "from", "person", "patient", "type", "messageType", "date", "messageStatus", "status", "actions"];
      
      columns = columns.sort((a, b) => {
        const indexA = columnOrder.indexOf(a.key);
        const indexB = columnOrder.indexOf(b.key);
        
        // If column not found in order, put it at the end
        const posA = indexA === -1 ? columnOrder.length : indexA;
        const posB = indexB === -1 ? columnOrder.length : indexB;
        
        return posA - posB;
      });
    }
    
    return columns;
  }, [currentColumns, activeTab]);

  console.log("MessagesList: Current messages:", currentMessages);
  console.log("MessagesList: Show filter:", showFilter);
  console.log("MessagesList: Active tab:", activeTab);
  console.log("MessagesList: Filtered columns:", filteredColumns);

  // Filter tasks based on search and filters
  const filteredTasks = currentMessages.filter((task) => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.assignedTo?.toLowerCase().includes(searchLower) ||
      task.person?.toLowerCase().includes(searchLower);

    // Filter by 'Show' (all/my) - when using "my", we rely on the data being properly separated
    // between allMessagesData and myMessagesData rather than filtering here
    const matchesShow = true; // Since we're using separate data arrays, no need to filter here

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && task.messageStatus === "unread") ||
      (statusFilter === "read" && task.messageStatus === "read");

    return matchesSearch && matchesShow && matchesStatus;
  });

  // Update parent component with current message count when it changes
  useEffect(() => {
    if (onMessageCountChange) {
      onMessageCountChange(filteredTasks.length);
    }
  }, [filteredTasks.length, onMessageCountChange]);

  console.log("MessagesList: Filtered tasks:", filteredTasks);
  console.log("MessagesList: Current columns:", currentColumns);
  console.log("MessagesList: filteredTasks.length:", filteredTasks.length);
  console.log("MessagesList: currentColumns.length:", currentColumns.length);

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="h-full">
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
              {activeTab === "inbox" &&
                (allMessagesData.length > 0 || myMessagesData.length > 0) && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {showFilter === "all"
                      ? allMessagesData.length
                      : myMessagesData.length}
                  </span>
                )}
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`pb-2 text-sm font-medium relative ${
                activeTab === "sent"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sent
              {activeTab === "sent" && sentMessages.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {sentMessages.length}
                </span>
              )}
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

          {/* Filters - Only show when not on Sent tab */}
          {activeTab !== "sent" && (
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              {/* Show Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Show:</span>
                <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    onClick={() => {
                      setShowFilter("all");
                      // Always fetch when clicked to ensure fresh data
                      fetchAllMessages();
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      showFilter === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Messages
                  </button>
                  <button
                    onClick={() => {
                      setShowFilter("my");
                      // Always fetch when clicked to ensure fresh data
                      fetchMyMessages();
                    }}
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
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
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
          )}
        </div>

        {/* Loading indicator for sent messages */}
        {loadingSent && activeTab === "sent" && (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 ml-2">
              Loading sent messages...
            </p>
          </div>
        )}

        {/* Messages Table */}
        {!loadingSent && (
          <div className="ag-theme-alpine ag-theme-custom rounded-lg border border-gray-200">
            {(() => {
              console.log(
                "MessagesList: Passing to AGGridTable - filteredTasks:",
                filteredTasks
              );
              console.log(
                "MessagesList: Passing to AGGridTable - filteredColumns:",
                filteredColumns
              );
              return null;
            })()}
            <AGGridTable
              tasks={filteredTasks}
              columns={filteredColumns}
              onReply={onReply}
              onComplete={onComplete}
              activeTab="messages"
              isPanelReady={true}
              panelWidth={panelWidth}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
