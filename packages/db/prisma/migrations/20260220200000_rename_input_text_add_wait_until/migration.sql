-- AlterEnum: rename input_text → type, add wait_until
ALTER TYPE "interaction" RENAME VALUE 'input_text' TO 'type';
ALTER TYPE "interaction" ADD VALUE 'wait_until';
