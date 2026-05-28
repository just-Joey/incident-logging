# Incident Logging Service

A production-grade GraphQL microservice for real-time incident management, error tracking, and application event logging — with AI-powered incident analysis via the Claude API.

**Live API:** https://incident-logging.onrender.com/graphql

---

## Overview

This service powers incident tracking across distributed systems. It provides a unified GraphQL API for logging incidents, ingesting errors, recording application events, and generating AI-driven summaries — structured for AWS deployment from day one.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| API | GraphQL · Apollo Server 5 |
| Framework | Express |
| ORM | Prisma 6.6.0 |
| Database | PostgreSQL (Neon) |
| AI | Claude API (Anthropic) |
| Logging | Pino (structured JSON) |
| Cloud | AWS Lambda-ready handler stub |

---

## Features

- **Four GraphQL domains** — Incidents, Errors, AppEvents, Dashboards
- **AI-powered incident summaries** — Claude analyzes incidents and returns root cause assessment, impact analysis, next steps, and a risk score
- **Service layer pattern** — business logic fully separated from resolvers, making Lambda migration a single config change
- **Prisma singleton** — connection pooling with query logging and N+1 prevention via DataLoader
- **Structured logging** — Pino outputs CloudWatch-native JSON in production
- **AWS-ready** — Lambda handler stub included, environment-based config detects runtime automatically
- **Health check endpoint** — `/health` for load balancer and uptime monitoring

---

## GraphQL API

### Queries

```graphql
# Fetch all incidents
query {
  incidents {
    id
    title
    severity
    status
    service
    createdAt
  }
}

# Fetch a single incident with linked errors and events
query {
  incident(id: "your-id") {
    id
    title
    severity
    status
    errors {
      message
      count
      status
    }
    events {
      type
      message
    }
  }
}

# AI-powered incident summary (Claude API)
query {
  summarizeIncident(incidentId: "your-id") {
    summary
    rootCause
    impact
    nextSteps
    riskScore
  }
}

# Dashboard aggregates
query {
  defaultDashboard {
    name
    openIncidents
    activeErrors
    recentEvents {
      type
      message
      createdAt
    }
  }
}
```

### Mutations

```graphql
# Create an incident
mutation {
  createIncident(input: {
    title: "Payment service latency spike"
    description: "P99 latency exceeded 2s threshold"
    severity: HIGH
    service: "payments-api"
    assignee: "on-call-engineer"
  }) {
    id
    title
    status
  }
}

# Resolve an incident
mutation {
  resolveIncident(id: "your-id") {
    id
    status
    resolvedAt
  }
}

# Log an error with deduplication
mutation {
  createError(input: {
    message: "Connection pool exhausted"
    service: "payments-api"
    fingerprint: "payments-api:connection-pool-exhausted"
  }) {
    id
    count
    status
  }
}

# Link an error to an incident
mutation {
  linkErrorToIncident(errorId: "error-id", incidentId: "incident-id") {
    id
    incident {
      title
    }
  }
}
```

---

## Data Model

```
Incident ──< Error      (one incident has many errors)
Incident ──< AppEvent   (one incident has many events)
```

### Enums

```
Severity:       LOW | MEDIUM | HIGH | CRITICAL
IncidentStatus: OPEN | INVESTIGATING | IDENTIFIED | MONITORING | RESOLVED
ErrorStatus:    ACTIVE | RESOLVED | IGNORED
EventType:      DEPLOYMENT | SCALING | AUTH | PAYMENT | SYSTEM | CUSTOM
```

---

## AI Summary Example

Given a `HIGH` severity incident on `payments-api`, the `summarizeIncident` query returns:

```json
{
  "summary": "The payments-api service experienced a significant latency spike with P99 response times exceeding the 2-second threshold across payment processors.",
  "rootCause": "Likely candidates include database query degradation, connection pool exhaustion, or a downstream payment processor experiencing slowdowns.",
  "impact": "All users attempting to complete payments are experiencing slow or degraded checkout experiences, directly affecting transaction completion rates and revenue.",
  "nextSteps": [
    "Review APM traces for the spike window to identify slow spans",
    "Check for recent deployments or config changes in the 30-60 minutes preceding the incident",
    "Inspect database connection pool metrics and external payment processor status pages",
    "Evaluate auto-scaling activity and infrastructure health",
    "Establish a 15-minute status update cadence with stakeholders"
  ],
  "riskScore": 8
}
```

---

## Project Structure

```
incident-service/
├── prisma/
│   ├── schema.prisma          # All 4 domain models + enums
│   └── migrations/            # SQL migration history
├── src/
│   ├── index.js               # Express + Apollo server bootstrap
│   ├── handler.js             # AWS Lambda handler stub
│   ├── schema/
│   │   ├── typeDefs/          # GraphQL type definitions (.graphql files)
│   │   │   ├── incident.graphql
│   │   │   ├── error.graphql
│   │   │   ├── event.graphql
│   │   │   ├── dashboard.graphql
│   │   │   ├── summary.graphql
│   │   │   └── shared.graphql # Shared enums
│   │   ├── resolvers/         # Thin resolver wrappers
│   │   └── index.js           # Merged typeDefs + resolvers
│   ├── services/              # Business logic layer
│   │   ├── incidentService.js
│   │   ├── errorService.js
│   │   ├── eventService.js
│   │   ├── dashboardService.js
│   │   └── summaryService.js  # Claude API integration
│   ├── lib/
│   │   ├── prisma.js          # Singleton Prisma client
│   │   ├── logger.js          # Pino structured logger
│   │   ├── anthropic.js       # Anthropic client
│   │   ├── dataloader.js      # N+1 prevention
│   │   └── context.js         # GraphQL context builder
│   └── config/
│       └── index.js           # Environment-based config
└── .env.example
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/joeymaes/incident-logging
cd incident-logging

# Install dependencies
yarn install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL and ANTHROPIC_API_KEY

# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Start dev server
yarn dev
```

Server runs at `http://localhost:4000/graphql`

---

## Environment Variables

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
GRAPHQL_INTROSPECTION=true
AWS_REGION=us-east-1
```

---

## AWS Deployment

The service is structured for AWS Lambda deployment. A handler stub at `src/handler.js` wraps the Express app — switching from local to Lambda requires only:

1. Swap `app.listen()` for the Lambda handler export
2. Set environment variables in Secrets Manager
3. Point API Gateway at the Lambda function

The `AWS_EXECUTION_ENV` variable is automatically set by the Lambda runtime — the app detects it and adjusts behavior accordingly.

---

## Architecture Decisions

**Why service layer?** Resolvers stay thin — all business logic lives in services. The same functions can be called from REST endpoints, Lambda handlers, or queue consumers without touching resolver code.

**Why Prisma 6.x pinned?** Prisma 7 introduced breaking changes. Pinning to 6.6.0 ensures stability while the ecosystem catches up.

**Why Pino?** Structured JSON output is CloudWatch-native. Every log line is queryable — filter by `level`, `service`, or any custom field across millions of log lines.

**Why DataLoader?** GraphQL's nested queries cause N+1 database calls by default. DataLoader batches them into single queries, keeping performance predictable at scale.

---

Built by [Joey Maes](https://joeymaes.dev) · Denver, CO
