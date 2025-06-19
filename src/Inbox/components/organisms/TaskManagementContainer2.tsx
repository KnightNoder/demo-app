import React, { useState, useCallback, useMemo } from 'react';
import { TaskTableHeader } from './TaskTableHeader';
import { TanStackTable, FetchDataProps, ServerResponse } from './TanStackTable';
import { MobileTaskList } from './MobileTaskList';
import axiosClient from '../../../api/axiosClient';

// Extended task interface with index signature for dynamic properties
export interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  person: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'in-progress';
  type: string;
  [key: string]: any; // This allows dynamic property access
}

// Import the ApiColumn interface
export interface ApiColumn {
  key: string;
  label: string;
}

export interface TaskManagementContainerProps {
  tasks: ExtendedTask[];
  columns?: ApiColumn[]; // Add optional columns prop
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  // Add new props for server-side pagination
  apiEndpoint?: string; // Optional API endpoint for server-side data
  useServerSide?: boolean; // Flag to enable server-side pagination
}

export const TaskManagementContainer: React.FC<TaskManagementContainerProps> = ({
  tasks,
  columns = [], // Default to empty array if not provided
  onReply,
  onComplete,
  apiEndpoint = '/inbox/birthdays', // Default endpoint
  useServerSide = true, // Default to server-side pagination
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("reminders");
  const [isExpanded, setIsExpanded] = useState(true);

  // Memoized server-side fetch function to prevent unnecessary re-renders
  const fetchServerData = useCallback(async (props: FetchDataProps): Promise<ServerResponse> => {
    const { pageIndex, pageSize, sorting, columnFilters, globalFilter } = props;
    
    try {
      // Build query parameters
      const params: any = {
        page: pageIndex + 1, // Most APIs use 1-based pagination
        per_page: pageSize,
      };

      // Add sorting
      if (sorting.length > 0) {
        const sort = sorting[0];
        params.sort_by = sort.id;
        params.sort_order = sort.desc ? 'desc' : 'asc';
      }

      // Add global filter
      if (globalFilter) {
        params.search = globalFilter;
      }

      // Add column filters
      columnFilters.forEach(filter => {
        params[`filter_${filter.id}`] = filter.value;
      });

      const response = await axiosClient.get(apiEndpoint, { params });
      
      // Transform the API response to match our ServerResponse interface
      // Adjust this based on your actual API response structure
      const apiData = response.data;
      
      return {
        data: apiData.data || [],
        totalCount: apiData.pagination?.total || 0,
        pageCount: apiData.pagination?.last_page || 0,
        hasNextPage: apiData.pagination?.current_page < apiData.pagination?.last_page,
        hasPreviousPage: apiData.pagination?.current_page > 1,
      };
    } catch (error) {
      console.error('Failed to fetch server data:', error);
      return {
        data: [],
        totalCount: 0,
        pageCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  }, [apiEndpoint]); // Only depend on apiEndpoint

  // Memoized client-side filter function (for backward compatibility)
  const filteredTasks = useMemo(() => {
    if (!searchValue) return tasks;
    
    const searchLower = searchValue.toLowerCase();
    return tasks.filter((task) => {
      // Search in standard task fields
      const standardFieldsMatch =
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower) ||
        task.person?.toLowerCase().includes(searchLower);

      // Search in dynamic columns from API
      const dynamicFieldsMatch = columns.some((column) => {
        const fieldValue = task[column.key];
        return (
          fieldValue && String(fieldValue).toLowerCase().includes(searchLower)
        );
      });

      return standardFieldsMatch || dynamicFieldsMatch;
    });
  }, [tasks, searchValue, columns]);

  // Memoized client-side fetch function
  const fetchClientData = useCallback(async (): Promise<ServerResponse> => {
    return {
      data: filteredTasks,
      totalCount: filteredTasks.length,
      pageCount: Math.ceil(filteredTasks.length / 20),
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }, [filteredTasks]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleFiltersClick = () => {
    console.log("Filters clicked");
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="w-full mx-auto">
        <TaskTableHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onFiltersClick={handleFiltersClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
          onExportCSV={() => {}}
        />

        {isExpanded && (
          <>
            <TanStackTable
              columns={columns}
              onReply={onReply}
              onComplete={onComplete}
              fetchData={useServerSide ? fetchServerData : fetchClientData}
              initialData={tasks}
              initialTotalCount={tasks.length}
              externalGlobalFilter={useServerSide ? searchValue : ""}
            />

            <MobileTaskList
              tasks={useServerSide ? tasks : filteredTasks}
              onReply={onReply}
              onComplete={onComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};