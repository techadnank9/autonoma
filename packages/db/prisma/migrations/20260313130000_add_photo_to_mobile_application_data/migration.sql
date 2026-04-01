ALTER TABLE "mobile_deployment"
ADD COLUMN "photo" TEXT;

UPDATE "mobile_deployment"
SET "photo" = 's3://autonoma-assets/uploads/default-files/cmmaq609e0032seug0dy32tjh/default-file.png'
WHERE "photo" IS NULL;

ALTER TABLE "mobile_deployment"
ALTER COLUMN "photo" SET NOT NULL;
