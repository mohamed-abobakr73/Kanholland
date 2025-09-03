import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRoute from "./routes/authRoute.js";
import pagesRoute from "./routes/pagesRoute.js";
import sectionsRoute from "./routes/sectionsRoute.js";
import prisma from "./config/prismaClient.js";
import SuperAdminCreator from "./scripts/createSuperAdmin.js";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "3mb" }));
app.use(express.json());
app.use(morgan("dev"));

async function initializeApp() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");

    // Create super admin
    const creator = new SuperAdminCreator();
    await creator.createSuperAdmin();

    // Start server
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
}

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/pages", pagesRoute);
app.use("/api/sections", sectionsRoute);

app.get("/health", (req, res) => res.status(200).json({ message: "Healthy" }));

// Error handler
app.use(globalErrorHandler);

initializeApp();

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
