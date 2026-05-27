export const eventService = {
  getAll: (prisma) =>
    prisma.appEvent.findMany({
      include: { incident: true },
      orderBy: { createdAt: 'desc' },
    }),

  getById: (prisma, id) =>
    prisma.appEvent.findUnique({
      where: { id },
      include: { incident: true },
    }),

  getByService: (prisma, service) =>
    prisma.appEvent.findMany({
      where: { service },
      orderBy: { createdAt: 'desc' },
    }),

  create: (prisma, input) =>
    prisma.appEvent.create({ data: input }),
}