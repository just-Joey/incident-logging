import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

const globalForPrisma = globalThis;

globalForPrisma.prisma ??= new PrismaClient({log: [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'error' }]});

const prisma = globalForPrisma.prisma;

prisma.$on('query', (e) => {
  logger.debug({ query: e.query, duration: `${e.duration}ms` }, 'DB query')
})

prisma.$on('error', (e) => {
  logger.error({ message: e.message }, 'DB error')
})

export default prisma;
