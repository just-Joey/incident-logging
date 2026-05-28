import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { incidentResolvers } from './resolvers/incident.js'
import { errorResolvers } from './resolvers/error.js'
import { eventResolvers } from './resolvers/event.js'
import { dashboardResolvers } from './resolvers/dashboard.js'
import { summaryResolver } from './resolvers/summary.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const typesArray = loadFilesSync(join(__dirname, './typeDefs/**/*.graphql'))

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers([
  incidentResolvers,
  errorResolvers,
  eventResolvers,
  dashboardResolvers,
  summaryResolver,
])