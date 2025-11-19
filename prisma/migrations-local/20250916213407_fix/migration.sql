/*
  Warnings:

  - You are about to drop the column `difficultyLevel` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `learningOutcomes` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisites` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to alter the column `topics` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `advancedTopics` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `topics` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
