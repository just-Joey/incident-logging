import { incidentService } from '../../services/incidentService.js'

export const incidentResolvers = {
  Query: {
    incidents: (_, __, { prisma }) => incidentService.getAll(prisma),
    incident: (_, { id }, { prisma }) => incidentService.getById(prisma, id),
  },
  Mutation: {
    createIncident: (_, { input }, { prisma }) => incidentService.create(prisma, input),
    updateIncident: (_, { id, input }, { prisma }) => incidentService.update(prisma, id, input),
    resolveIncident: (_, { id }, { prisma }) => incidentService.resolve(prisma, id),
    deleteIncident: (_, { id }, { prisma }) => incidentService.delete(prisma, id),
  },
}