// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Optional: Add error handling and connection management
prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Database connection error:", error));

// Handle graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
