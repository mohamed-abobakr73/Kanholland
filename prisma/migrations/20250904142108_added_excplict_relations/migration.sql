/*
  Warnings:

  - You are about to drop the column `entityId` on the `Background_Image` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `Background_Image` table. All the data in the column will be lost.

*/
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
    CONSTRAINT "Background_Image_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Background_Image_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Background_Image" ("fileName", "fileSize", "fileUrl", "id", "mimeType") SELECT "fileName", "fileSize", "fileUrl", "id", "mimeType" FROM "Background_Image";
DROP TABLE "Background_Image";
ALTER TABLE "new_Background_Image" RENAME TO "Background_Image";
CREATE UNIQUE INDEX "Background_Image_pageId_key" ON "Background_Image"("pageId");
CREATE UNIQUE INDEX "Background_Image_sectionId_key" ON "Background_Image"("sectionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
