import { Router } from "express";
import {
  createSectionHandler,
  getSectionsHandler,
  getSectionByIdHandler,
  updateSectionHandler,
  deleteSectionHandler,
} from "../controllers/sectionsController.js";

import {
  createSectionSchema,
  updateSectionSchema,
} from "../schemas/sectionsSchema.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { upload } from "../config/multer.js";

const sectionsRoute = Router();

sectionsRoute.post(
  "/",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
    { name: "media", maxCount: 10 }, // allow up to 10 media files
  ]),
  validateRequestBody(createSectionSchema.partial()), // allow flexible body
  createSectionHandler
);

sectionsRoute.get("/", getSectionsHandler);
sectionsRoute.get("/:id", getSectionByIdHandler);

// Update section with file uploads
sectionsRoute.put(
  "/:id",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
    { name: "media", maxCount: 10 }, // allow up to 10 media files
  ]),
  validateRequestBody(updateSectionSchema.partial()),
  updateSectionHandler
);

sectionsRoute.delete("/:id", deleteSectionHandler);

export default sectionsRoute;
