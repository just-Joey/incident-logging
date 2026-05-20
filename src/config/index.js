import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),

  db: {
    url: process.env.DATABASE_URL,
  },

  graphql: {
    introspection: process.env.GRAPHQL_INTROSPECTION !== 'false',
    playground: process.env.NODE_ENV !== 'production',
  },

  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    isLambda: !!process.env.AWS_EXECUTION_ENV,  // Lambda sets this automatically
  },
}

// Fail fast if critical config is missing
if (!config.db.url) {
  throw new Error('DATABASE_URL is required')
}

export default config