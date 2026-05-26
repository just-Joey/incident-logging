-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ErrorStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'IGNORED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('DEPLOYMENT', 'SCALING', 'AUTH', 'PAYMENT', 'SYSTEM', 'CUSTOM');

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "service" TEXT,
    "assignee" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errors" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "service" TEXT NOT NULL,
    "status" "ErrorStatus" NOT NULL DEFAULT 'ACTIVE',
    "count" INTEGER NOT NULL DEFAULT 1,
    "fingerprint" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "incidentId" UUID,

    CONSTRAINT "errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_events" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "payload" JSONB,
    "severity" "Severity" NOT NULL DEFAULT 'LOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentId" UUID,

    CONSTRAINT "app_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "errors_fingerprint_idx" ON "errors"("fingerprint");

-- CreateIndex
CREATE INDEX "errors_service_idx" ON "errors"("service");

-- CreateIndex
CREATE INDEX "app_events_service_idx" ON "app_events"("service");

-- CreateIndex
CREATE INDEX "app_events_type_idx" ON "app_events"("type");

-- CreateIndex
CREATE INDEX "app_events_createdAt_idx" ON "app_events"("createdAt");

-- AddForeignKey
ALTER TABLE "errors" ADD CONSTRAINT "errors_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_events" ADD CONSTRAINT "app_events_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
