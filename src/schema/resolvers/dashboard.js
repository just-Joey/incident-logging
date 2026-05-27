import { dashboardService } from '../../services/dashboardService.js'

export const dashboardResolvers = {
  Query: {
    dashboards: (_, __, { prisma }) => dashboardService.getAll(prisma),
    dashboard: (_, { id }, { prisma }) => dashboardService.getById(prisma, id),
    defaultDashboard: (_, __, { prisma }) => dashboardService.getDefault(prisma),
  },
  Mutation: {
    createDashboard: (_, { input }, { prisma }) => dashboardService.create(prisma, input),
    updateDashboard: (_, { id, input }, { prisma }) => dashboardService.update(prisma, id, input),
    deleteDashboard: (_, { id }, { prisma }) => dashboardService.delete(prisma, id),
  },
  // Computed fields on the Dashboard type
  Dashboard: {
    openIncidents: (_, __, { prisma }) =>
      prisma.incident.count({ where: { status: { not: 'RESOLVED' } } }),
    activeErrors: (_, __, { prisma }) =>
      prisma.error.count({ where: { status: 'ACTIVE' } }),
    recentEvents: (_, __, { prisma }) =>
      prisma.appEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
  },
}