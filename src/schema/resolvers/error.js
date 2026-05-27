import { errorService } from '../../services/errorService.js'

export const errorResolvers = {
  Query: {
    errors: (_, __, { prisma }) => errorService.getAll(prisma),
    error: (_, { id }, { prisma }) => errorService.getById(prisma, id),
    errorsByService: (_, { service }, { prisma }) => errorService.getByService(prisma, service),
  },
  Mutation: {
    createError: (_, { input }, { prisma }) => errorService.create(prisma, input),
    resolveError: (_, { id }, { prisma }) => errorService.resolve(prisma, id),
    linkErrorToIncident: (_, { errorId, incidentId }, { prisma }) =>
      errorService.linkToIncident(prisma, errorId, incidentId),
  },
}