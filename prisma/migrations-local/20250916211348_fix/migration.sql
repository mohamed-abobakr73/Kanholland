/*
  Warnings:

  - You are about to drop the `TrainingProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DogToTrainingProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `age` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Dog` table. All the data in the column will be lost.
  - You are about to drop the column `trainingLevel` on the `Dog` table. All the data in the column will be lost.
  - Added the required column `firstDescription` to the `Dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondDescription` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_DogToTrainingProgram_B_index";

-- DropIndex
DROP INDEX "_DogToTrainingProgram_AB_unique";

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
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstDescription" TEXT NOT NULL,
    "secondDescription" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Dog" ("createdAt", "id", "name", "updatedAt", "updatedBy") SELECT "createdAt", "id", "name", "updatedAt", "updatedBy" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
