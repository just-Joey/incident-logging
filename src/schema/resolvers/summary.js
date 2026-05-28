import {summaryService} from '../../services/summaryService.js';

export const summaryResolver = {
  Query: {
    summarizeIncident: async (_, { incidentId }, { prisma }) => {
      return summaryService.summarizeIncident(prisma, incidentId)
    },
  },
};  