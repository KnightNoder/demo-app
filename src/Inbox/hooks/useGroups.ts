import { useState, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

interface Group {
  id: number;
  name: string;
  type: string;
}

interface GroupsApiResponse {
  success: boolean;
  data: Group[];
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      const response = await axiosClient.get<GroupsApiResponse>("/acl/groups");
      if (response.data.success) {
        setGroups(response.data.data);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (error) {
      const errorMessage = "Failed to fetch groups.";
      setGroupsError(errorMessage);
      console.error(errorMessage, error);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  return { groups, groupsLoading, groupsError, fetchGroups };
};
