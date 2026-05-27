import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import express from 'express'
import cors from 'cors'
import { typeDefs, resolvers } from './schema/index.js'
import { createContext } from './lib/context.js'
import logger from './lib/logger.js'
import config from './config/index.js'

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: config.graphql.introspection,
})

await server.start()

app.use(cors())
app.use(express.json())

app.use(
  '/graphql',
  cors(),
  express.json(),  // ← must be before expressMiddleware
  expressMiddleware(server, {
    context: createContext,
  })
)

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(config.port, () => {
  logger.info(`🚀 Server running at http://localhost:${config.port}/graphql`)
  logger.info(`❤️  Health check at http://localhost:${config.port}/health`)
})