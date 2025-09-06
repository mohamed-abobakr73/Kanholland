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
    { name: "media", maxCount: 10 },
  ]),
  validateRequestBody(createSectionSchema.partial()),
  createSectionHandler
);

sectionsRoute.get("/", getSectionsHandler);
sectionsRoute.get("/:id", getSectionByIdHandler);

sectionsRoute.put(
  "/:id",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  validateRequestBody(updateSectionSchema.partial()),
  updateSectionHandler
);

sectionsRoute.delete("/:id", deleteSectionHandler);

export default sectionsRoute;
