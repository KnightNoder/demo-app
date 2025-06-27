import { useState, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import { ApiResponse, OptionItem } from '../types/taskTypes';

const FALLBACK_OPTIONS = {
  priority: ["High", "Medium", "Low"],
  progress: ["Not Started Yet", "In Progress", "On Hold", "Completed"],
};

export const useTaskOptions = () => {
  const [priorityOptions, setPriorityOptions] = useState<string[]>([]);
  const [progressOptions, setProgressOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setOptionsLoading(true);
      setOptionsError(null);

      const [priorityResponse, progressResponse] = await Promise.all([
        axiosClient.get<ApiResponse<OptionItem[]>>("/list-options/priority_levels"),
        axiosClient.get<ApiResponse<OptionItem[]>>("/list-options/task_progress"),
      ]);

      let priorities: string[] = [];
      let progress: string[] = [];

      if (priorityResponse.data.success) {
        priorities = priorityResponse.data.data.map((item: OptionItem) => item.title);
        setPriorityOptions(priorities);
      } else {
        throw new Error("Failed to load priority options");
      }

      if (progressResponse.data.success) {
        progress = progressResponse.data.data.map((item: OptionItem) => item.title);
        setProgressOptions(progress);
      } else {
        throw new Error("Failed to load progress options");
      }

      return { priorities, progress };
    } catch (err) {
      console.error("Failed to fetch options:", err);
      setOptionsError("Failed to load options");

      setPriorityOptions(FALLBACK_OPTIONS.priority);
      setProgressOptions(FALLBACK_OPTIONS.progress);

      return {
        priorities: FALLBACK_OPTIONS.priority,
        progress: FALLBACK_OPTIONS.progress,
      };
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  return {
    priorityOptions,
    progressOptions,
    optionsLoading,
    optionsError,
    fetchOptions,
  };
};