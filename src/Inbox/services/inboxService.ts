// src/services/inbox/inboxService.ts
import {
  fetchBirthdayCount,
  fetchBirthdayDataForPanel,
} from "./birthdayService";
import {
  fetchUrgentTaskCounts,
  fetchUrgentTasksDataForPanel,
} from "./taskService";

import { fetchAgendaDataForPanel } from "./agendaService";
import axiosClient from "../../api/axiosClient";

export const fetchMessages = async () => {
  const response = await axiosClient.get(
    "/inbox/messages?format=inbox_list&show_all=yes&per_page=1000"
  );
  return response.data;
};

export const fetchSentMessages = async () => {
  const response = await axiosClient.get(
    "/inbox/messages?format=sent_list&show_all=yes&per_page=100"
  );
  return response.data;
};

export const fetchMyMessages = async () => {
  const response = await axiosClient.get(
    "/inbox/messages?format=inbox_list&per_page=100"
  );
  return response.data;
};

export const InboxService = {
  fetchBirthdayCount,
  fetchBirthdayDataForPanel,
  fetchUrgentTaskCounts,
  fetchUrgentTasksDataForPanel,
  fetchAgendaDataForPanel,
  fetchMessages,
  fetchSentMessages,
  fetchMyMessages,

  fetchInitialData: async () => {
    return Promise.all([
      fetchBirthdayCount(),
      fetchUrgentTaskCounts(),
      fetchAgendaDataForPanel(),
    ]);
  },
};