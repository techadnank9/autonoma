ALTER TABLE "web_deployment"
ADD COLUMN "file" TEXT;

UPDATE "web_deployment"
SET "file" = 's3://autonoma-assets/uploads/default-files/cmmaq609e0032seug0dy32tjh/default-file.png'
WHERE "file" IS NULL;

ALTER TABLE "web_deployment"
ALTER COLUMN "file" SET NOT NULL;
