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
  verifyToken,
  upload.single("backgroundImage"),
  validateRequestBody(createPageSchema),
  createPageHandler
);

pagesRoute.get("/", verifyToken, getAllPagesHandler);
pagesRoute.get("/:id", verifyToken, getPageHandler);

pagesRoute.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
  ]),
  // validateRequestBody(updatePageSchema),
  updatePageHandler
);

pagesRoute.delete("/:id", verifyToken, deletePageHandler);

export default pagesRoute;
