import { eventService } from '../../services/eventService.js'

export const eventResolvers = {
  Query: {
    appEvents: (_, __, { prisma }) => eventService.getAll(prisma),
    appEvent: (_, { id }, { prisma }) => eventService.getById(prisma, id),
    appEventsByService: (_, { service }, { prisma }) => eventService.getByService(prisma, service),
  },
  Mutation: {
    createAppEvent: (_, { input }, { prisma }) => eventService.create(prisma, input),
  },
}

