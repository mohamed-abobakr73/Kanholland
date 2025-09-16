import { Router } from "express";
import {
  createSectionHandler,
  getSectionsHandler,
  getSectionByIdHandler,
  updateSectionHandler,
  deleteSectionHandler,
} from "../controllers/sectionsController.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createSectionSchema,
  updateSectionSchema,
} from "../schemas/sectionsSchema.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { upload } from "../config/multer.js";

const sectionsRoute = Router();

sectionsRoute.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  validateRequestBody(createSectionSchema.partial()),
  createSectionHandler
);

sectionsRoute.get("/", verifyToken, getSectionsHandler);
sectionsRoute.get("/:id", verifyToken, getSectionByIdHandler);

sectionsRoute.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "backgroundVideo", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  validateRequestBody(updateSectionSchema.partial()),
  updateSectionHandler
);

sectionsRoute.delete("/:id", verifyToken, deleteSectionHandler);

export default sectionsRoute;
