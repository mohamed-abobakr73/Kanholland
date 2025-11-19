/*
  Warnings:

  - Added the required column `title` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
INSERT INTO "new_Dog" ("createdAt", "firstDescription", "id", "name", "secondDescription", "updatedAt", "updatedBy") SELECT "createdAt", "firstDescription", "id", "name", "secondDescription", "updatedAt", "updatedBy" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
