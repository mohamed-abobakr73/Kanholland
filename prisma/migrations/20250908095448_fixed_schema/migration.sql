/*
  Warnings:

  - You are about to drop the `DogMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DogTrainingProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `profileImageId` on the `Dog` table. All the data in the column will be lost.
  - Added the required column `dogId` to the `TrainingProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DogMedia_dogId_mediaId_key";

-- DropIndex
DROP INDEX "DogMedia_mediaId_idx";

-- DropIndex
DROP INDEX "DogMedia_dogId_idx";

-- DropIndex
DROP INDEX "DogTrainingProgram_dogId_trainingProgramId_key";

-- DropIndex
DROP INDEX "DogTrainingProgram_trainingProgramId_idx";

-- DropIndex
DROP INDEX "DogTrainingProgram_dogId_idx";

-- DropIndex
DROP INDEX "RefreshToken_expiresAt_idx";

-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DogMedia";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DogTrainingProgram";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RefreshToken";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_DogToTrainingProgram" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DogToTrainingProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Dog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DogToTrainingProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "TrainingProgram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Background_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "pageId" INTEGER,
    "sectionId" INTEGER,
    "dogId" INTEGER,
    CONSTRAINT "Background_Image_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Background_Image_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Background_Image_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Background_Image" ("fileName", "fileSize", "fileUrl", "id", "mimeType", "pageId", "sectionId") SELECT "fileName", "fileSize", "fileUrl", "id", "mimeType", "pageId", "sectionId" FROM "Background_Image";
DROP TABLE "Background_Image";
ALTER TABLE "new_Background_Image" RENAME TO "Background_Image";
CREATE UNIQUE INDEX "Background_Image_pageId_key" ON "Background_Image"("pageId");
CREATE UNIQUE INDEX "Background_Image_sectionId_key" ON "Background_Image"("sectionId");
CREATE UNIQUE INDEX "Background_Image_dogId_key" ON "Background_Image"("dogId");
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Dog" ("age", "breed", "certifications", "createdAt", "id", "isAvailable", "name", "specialization", "trainingLevel", "updatedAt", "updatedBy") SELECT "age", "breed", "certifications", "createdAt", "id", "isAvailable", "name", "specialization", "trainingLevel", "updatedAt", "updatedBy" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "pageId" INTEGER,
    "sectionId" INTEGER,
    "dogId" INTEGER,
    CONSTRAINT "Media_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Media_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Media_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("fileName", "fileSize", "fileUrl", "id", "mimeType", "pageId", "sectionId", "uploadedAt", "uploadedBy") SELECT "fileName", "fileSize", "fileUrl", "id", "mimeType", "pageId", "sectionId", "uploadedAt", "uploadedBy" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE TABLE "new_TrainingProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "programName" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevel" INTEGER,
    "duration" TEXT,
    "status" TEXT
);
INSERT INTO "new_TrainingProgram" ("description", "difficultyLevel", "duration", "id", "programName", "status") SELECT "description", "difficultyLevel", "duration", "id", "programName", "status" FROM "TrainingProgram";
DROP TABLE "TrainingProgram";
ALTER TABLE "new_TrainingProgram" RENAME TO "TrainingProgram";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "passwordHash", "role", "updatedAt", "username") SELECT "createdAt", "email", "id", "passwordHash", "role", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_DogToTrainingProgram_AB_unique" ON "_DogToTrainingProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_DogToTrainingProgram_B_index" ON "_DogToTrainingProgram"("B");
