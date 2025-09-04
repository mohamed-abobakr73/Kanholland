import express from "express";
import {
  createPageHandler,
  getPageHandler,
  getAllPagesHandler,
  updatePageHandler,
  deletePageHandler,
} from "../controllers/pagesController.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { createPageSchema } from "../schemas/pagesSchema.js";
import { upload } from "../config/multer.js";
import verifyToken from "../middlewares/verifyToken.js";

const pagesRoute = express.Router();

// Create page with file uploads
pagesRoute.post(
  "/",
  // verifyToken,
  upload.single("backgroundImage"),
  validateRequestBody(createPageSchema),
  createPageHandler
);

pagesRoute.get("/", getAllPagesHandler);
pagesRoute.get("/:id", getPageHandler);

pagesRoute.put(
  "/:id",
  upload.single("backgroundImage"),
  // validateRequestBody(updatePageSchema),
  updatePageHandler
);

pagesRoute.delete("/:id", deletePageHandler);

export default pagesRoute;
