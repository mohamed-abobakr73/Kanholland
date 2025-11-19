/*
  Warnings:

  - You are about to alter the column `content` on the `Section` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "backgroundImage" TEXT,
    "backgroundVideo" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("backgroundImage", "backgroundVideo", "content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt") SELECT "backgroundImage", "backgroundVideo", "content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");
CREATE UNIQUE INDEX "Section_pageId_orderIndex_key" ON "Section"("pageId", "orderIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
