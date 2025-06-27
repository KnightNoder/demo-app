import { useState, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import { ApiResponse, User } from '../types/taskTypes';

const FALLBACK_USERS: User[] = [
  { id: 1, name: "Dr. Sarah Johnson", type: "staff", role: "Physician" },
  { id: 2, name: "Dr. Michael Chen", type: "staff", role: "Surgeon" },
  { id: 3, name: "Nurse Rebecca Adams", type: "staff", role: "Registered Nurse" },
  { id: 4, name: "Admin Assistant", type: "staff", role: "Administrative" },
  { id: 5, name: "IT Support", type: "staff", role: "Technical" },
];

export const useTaskUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);

      const response = await axiosClient.get<ApiResponse<User[]>>("/users");

      if (response.data.success) {
        const usersWithType = response.data.data.map((user: User) => ({
          ...user,
          type: "staff" as const,
          role: "Staff",
        }));
        setUsers(usersWithType);
      } else {
        throw new Error("Failed to load users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsersError("Failed to load users");
      setUsers(FALLBACK_USERS);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  return {
    users,
    usersLoading,
    usersError,
    fetchUsers,
  };
};