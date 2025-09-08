/*
  Warnings:

  - You are about to drop the column `backgroundVideoUrl` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundVideo` on the `Section` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Background_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "pageId" INTEGER,
    "sectionId" INTEGER,
    CONSTRAINT "Background_Video_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Background_Video_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Page" ("createdAt", "createdBy", "description", "id", "slug", "title", "updatedAt", "updatedBy") SELECT "createdAt", "createdBy", "description", "id", "slug", "title", "updatedAt", "updatedBy" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE TABLE "new_Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Section" ("content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt") SELECT "content", "createdAt", "id", "orderIndex", "pageId", "title", "updatedAt" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");
CREATE UNIQUE INDEX "Section_pageId_orderIndex_key" ON "Section"("pageId", "orderIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Background_Video_pageId_key" ON "Background_Video"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "Background_Video_sectionId_key" ON "Background_Video"("sectionId");
