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

export const InboxService = {
  fetchBirthdayCount,
  fetchBirthdayDataForPanel,
  fetchUrgentTaskCounts,
  fetchUrgentTasksDataForPanel,
  fetchAgendaDataForPanel,
  
  fetchInitialData: async () => {
    return Promise.all([
      fetchBirthdayCount(),
      fetchUrgentTaskCounts(),
      fetchAgendaDataForPanel()
    ]);
  },
};