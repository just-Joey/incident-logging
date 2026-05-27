export const dashboardService = {
  getAll: (prisma) =>
    prisma.dashboard.findMany({ orderBy: { createdAt: 'desc' } }),

  getById: (prisma, id) =>
    prisma.dashboard.findUnique({ where: { id } }),

  getDefault: (prisma) =>
    prisma.dashboard.findFirst({ where: { isDefault: true } }),

  create: (prisma, input) =>
    prisma.dashboard.create({ data: input }),

  update: (prisma, id, input) =>
    prisma.dashboard.update({ where: { id }, data: input }),

  delete: (prisma, id) =>
    prisma.dashboard.delete({ where: { id } }),

  // Computed aggregates for dashboard widgets
  getStats: async (prisma) => {
    const [openIncidents, activeErrors] = await Promise.all([
      prisma.incident.count({ where: { status: { not: 'RESOLVED' } } }),
      prisma.error.count({ where: { status: 'ACTIVE' } }),
    ])
    return { openIncidents, activeErrors }
  },
}