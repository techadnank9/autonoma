-- CreateEnum
CREATE TYPE "ApplicationArchitecture" AS ENUM ('WEB', 'IOS', 'ANDROID');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "architecture" "ApplicationArchitecture" NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebApplicationData" (
    "applicationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "WebApplicationData_pkey" PRIMARY KEY ("applicationId")
);

-- CreateTable
CREATE TABLE "MobileApplicationData" (
    "applicationId" TEXT NOT NULL,
    "packageUrl" TEXT NOT NULL,

    CONSTRAINT "MobileApplicationData_pkey" PRIMARY KEY ("applicationId")
);

-- AddForeignKey
ALTER TABLE "WebApplicationData" ADD CONSTRAINT "WebApplicationData_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileApplicationData" ADD CONSTRAINT "MobileApplicationData_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
