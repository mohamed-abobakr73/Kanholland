/*
  Warnings:

  - You are about to drop the `CourseMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageBackgroundImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `profileImageId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundImage` on the `Section` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseMedia_courseId_mediaId_key";

-- DropIndex
DROP INDEX "CourseMedia_mediaId_idx";

-- DropIndex
DROP INDEX "CourseMedia_courseId_idx";

-- DropIndex
DROP INDEX "PageBackgroundImage_pageId_orderIndex_key";

-- DropIndex
DROP INDEX "PageBackgroundImage_pageId_idx";

-- DropIndex
DROP INDEX "SectionMedia_sectionId_mediaId_key";

-- DropIndex
DROP INDEX "SectionMedia_mediaId_idx";

-- DropIndex
DROP INDEX "SectionMedia_sectionId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CourseMedia";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PageBackgroundImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SectionMedia";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Background_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topics" TEXT,
    "learningOutcomes" TEXT,
    "prerequisites" TEXT,
    "duration" TEXT,
    "difficultyLevel" INTEGER,
    "maxParticipants" INTEGER,
    "price" REAL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Course" ("createdAt", "createdBy", "description", "difficultyLevel", "duration", "id", "isAvailable", "learningOutcomes", "maxParticipants", "prerequisites", "price", "status", "title", "topics", "updatedAt") SELECT "createdAt", "createdBy", "description", "difficultyLevel", "duration", "id", "isAvailable", "learningOutcomes", "maxParticipants", "prerequisites", "price", "status", "title", "topics", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "age" INTEGER,
    "trainingLevel" INTEGER,
    "certifications" TEXT,
    "specialization" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT,
    "profileImageId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Dog" ("age", "breed", "certifications", "createdAt", "id", "isAvailable", "name", "profileImageId", "specialization", "trainingLevel", "updatedAt", "updatedBy") SELECT "age", "breed", "certifications", "createdAt", "id", "isAvailable", "name", "profileImageId", "specialization", "trainingLevel", "updatedAt", "updatedBy" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
CREATE TABLE "new_DogMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    CONSTRAINT "DogMedia_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DogMedia" ("dogId", "id", "mediaId") SELECT "dogId", "id", "mediaId" FROM "DogMedia";
DROP TABLE "DogMedia";
ALTER TABLE "new_DogMedia" RENAME TO "DogMedia";
CREATE INDEX "DogMedia_dogId_idx" ON "DogMedia"("dogId");
CREATE INDEX "DogMedia_mediaId_idx" ON "DogMedia"("mediaId");
CREATE UNIQUE INDEX "DogMedia_dogId_mediaId_key" ON "DogMedia"("dogId", "mediaId");
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL
);
INSERT INTO "new_Media" ("fileName", "fileSize", "fileUrl", "id", "mimeType", "uploadedAt", "uploadedBy") SELECT "fileName", "fileSize", "fileUrl", "id", "mimeType", "uploadedAt", "uploadedBy" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE INDEX "Media_entityId_idx" ON "Media"("entityId");
CREATE UNIQUE INDEX "Media_entityType_entityId_key" ON "Media"("entityType", "entityId");
CREATE TABLE "new_Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "backgroundVideo" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("backgroundVideo", "content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt") SELECT "backgroundVideo", "content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");
CREATE UNIQUE INDEX "Section_pageId_orderIndex_key" ON "Section"("pageId", "orderIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Background_Image_entityType_entityId_key" ON "Background_Image"("entityType", "entityId");
