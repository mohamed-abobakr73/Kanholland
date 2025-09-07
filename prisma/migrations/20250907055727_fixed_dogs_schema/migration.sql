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
CREATE TABLE "new_TrainingProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dogId" INTEGER NOT NULL,
    "programName" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevel" INTEGER,
    "duration" TEXT,
    "status" TEXT
);
INSERT INTO "new_TrainingProgram" ("description", "difficultyLevel", "dogId", "duration", "id", "programName", "status") SELECT "description", "difficultyLevel", "dogId", "duration", "id", "programName", "status" FROM "TrainingProgram";
DROP TABLE "TrainingProgram";
ALTER TABLE "new_TrainingProgram" RENAME TO "TrainingProgram";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_DogToTrainingProgram_AB_unique" ON "_DogToTrainingProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_DogToTrainingProgram_B_index" ON "_DogToTrainingProgram"("B");
