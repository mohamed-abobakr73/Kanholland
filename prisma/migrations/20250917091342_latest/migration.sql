/*
  Warnings:

  - You are about to drop the `TrainingProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DogToTrainingProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `difficultyLevel` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `learningOutcomes` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisites` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to alter the column `topics` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `age` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `trainingLevel` on the `Dog` table. All the data in the column will be lost.
  - Added the required column `advancedTopics` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `topics` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstDescription` to the `Dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondDescription` to the `Dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_DogToTrainingProgram_B_index";

-- DropIndex
DROP INDEX "_DogToTrainingProgram_AB_unique";

-- AlterTable
ALTER TABLE "Background_Video" ADD COLUMN "duration" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingProgram";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_DogToTrainingProgram";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "note" TEXT,
    "topics" JSONB NOT NULL,
    "advancedTopics" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Course" ("createdAt", "createdBy", "description", "id", "title", "topics", "updatedAt") SELECT "createdAt", "createdBy", "description", "id", "title", "topics", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstDescription" TEXT NOT NULL,
    "secondDescription" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Dog" ("createdAt", "id", "name", "updatedAt", "updatedBy") SELECT "createdAt", "id", "name", "updatedAt", "updatedBy" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
