-- CreateEnum
CREATE TYPE "github_installation_status" AS ENUM ('active', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "github_indexing_status" AS ENUM ('pending', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "github_deployment_trigger" AS ENUM ('push', 'github_action');

-- CreateEnum
CREATE TYPE "github_deployment_status" AS ENUM ('pending', 'fetching_diff', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "github_generation_status" AS ENUM ('pending', 'running', 'completed', 'failed');

-- Ensure organization.id has a primary key (defensive: pg_restore with || true can silently
-- drop constraints, leaving the table without a PK and breaking FK creation below)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'organization'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE "organization" ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

-- CreateTable
CREATE TABLE "github_installation" (
    "id" TEXT NOT NULL,
    "installation_id" INTEGER NOT NULL,
    "organization_id" TEXT NOT NULL,
    "account_login" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "account_type" TEXT NOT NULL,
    "status" "github_installation_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_installation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_repository" (
    "id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "github_repo_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "default_branch" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "indexing_status" "github_indexing_status" NOT NULL DEFAULT 'pending',
    "indexed_at" TIMESTAMP(3),
    "watch_branch" TEXT NOT NULL DEFAULT 'main',
    "deployment_trigger" "github_deployment_trigger" NOT NULL DEFAULT 'push',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "generation_status" "github_generation_status",
    "autonoma_url" TEXT,
    "tests_url" TEXT,
    "application_id" TEXT,

    CONSTRAINT "github_repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_deployment" (
    "id" TEXT NOT NULL,
    "repository_id" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "base_sha" TEXT,
    "environment" TEXT NOT NULL,
    "url" TEXT,
    "diff" TEXT,
    "status" "github_deployment_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_repository_file" (
    "id" TEXT NOT NULL,
    "repository_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT,
    "sha" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_repository_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_installation_installation_id_key" ON "github_installation"("installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_installation_organization_id_key" ON "github_installation"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_repository_installation_id_github_repo_id_key" ON "github_repository"("installation_id", "github_repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_repository_file_repository_id_path_key" ON "github_repository_file"("repository_id", "path");

-- AddForeignKey
ALTER TABLE "github_installation" ADD CONSTRAINT "github_installation_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_repository" ADD CONSTRAINT "github_repository_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "github_installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_repository" ADD CONSTRAINT "github_repository_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_deployment" ADD CONSTRAINT "github_deployment_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "github_repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_repository_file" ADD CONSTRAINT "github_repository_file_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "github_repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
