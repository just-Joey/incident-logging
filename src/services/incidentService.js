export const incidentService = {
  getAll: (prisma) =>
    prisma.incident.findMany({
      include: { errors: true, events: true },
      orderBy: { createdAt: 'desc' },
    }),

  getById: (prisma, id) =>
    prisma.incident.findUnique({
      where: { id },
      include: { errors: true, events: true },
    }),

  create: (prisma, input) =>
    prisma.incident.create({ data: input }),

  update: (prisma, id, input) =>
    prisma.incident.update({ where: { id }, data: input }),

  resolve: (prisma, id) =>
    prisma.incident.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    }),

  delete: (prisma, id) =>
    prisma.incident.delete({ where: { id } }),
}