export const errorService = {
  getAll: (prisma) =>
    prisma.error.findMany({
      include: { incident: true },
      orderBy: { createdAt: 'desc' },
    }),

  getById: (prisma, id) =>
    prisma.error.findUnique({
      where: { id },
      include: { incident: true },
    }),

  getByService: (prisma, service) =>
    prisma.error.findMany({
      where: { service },
      include: { incident: true },
    }),

  create: (prisma, input) =>
    // Check for existing error with same fingerprint first
    prisma.error.upsert({
      where: { fingerprint: input.fingerprint },
      update: { count: { increment: 1 } },
      create: input,
    }),

  resolve: (prisma, id) =>
    prisma.error.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    }),

  linkToIncident: (prisma, errorId, incidentId) =>
    prisma.error.update({
      where: { id: errorId },
      data: { incidentId },
    }),
}