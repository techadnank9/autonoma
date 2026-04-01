-- CreateEnum
CREATE TYPE "interaction" AS ENUM ('click', 'input_text', 'navigate', 'assert', 'scroll', 'hover', 'upload_file', 'extract_information');

-- CreateEnum
CREATE TYPE "run_step_status" AS ENUM ('pending', 'running', 'passed', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "conversation_message_role" AS ENUM ('user', 'assistant', 'system', 'tool_call');

-- CreateTable
CREATE TABLE "folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "application_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "application_id" TEXT NOT NULL,
    "generation_id" TEXT,
    "folder_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_step" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "interaction" "interaction" NOT NULL,
    "instruction" TEXT NOT NULL,
    "screenshot_before" TEXT,
    "screenshot_after" TEXT,
    "message" TEXT,
    "reasoning" TEXT,
    "element" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_tag" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "test_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_step" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "test_step_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "run_step_status" NOT NULL,
    "screenshot_before" TEXT,
    "screenshot_after" TEXT,
    "message" TEXT,
    "reasoning" TEXT,
    "element" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "run_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_message" (
    "id" TEXT NOT NULL,
    "generation_id" TEXT NOT NULL,
    "role" "conversation_message_role" NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_tag_test_id_tag_id_key" ON "test_tag"("test_id", "tag_id");

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation" ADD CONSTRAINT "generation_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "generation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_step" ADD CONSTRAINT "test_step_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_tag" ADD CONSTRAINT "test_tag_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_tag" ADD CONSTRAINT "test_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_step" ADD CONSTRAINT "run_step_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_step" ADD CONSTRAINT "run_step_test_step_id_fkey" FOREIGN KEY ("test_step_id") REFERENCES "test_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "conversation_message_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
