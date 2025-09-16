import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import {
  createDogHandler,
  getDogsHandler,
  getDogByIdHandler,
  updateDogHandler,
  deleteDogHandler,
} from "../controllers/dogsController.js";
import { createDogSchema } from "../schemas/dogsSchema.js";
import { upload } from "../config/multer.js";

const dogsRoute = Router();

dogsRoute.get("/", getDogsHandler);

dogsRoute.get("/:id", getDogByIdHandler);

dogsRoute.post(
  "/",
  verifyToken,
  upload.fields([{ name: "media", maxCount: 10 }]),
  validateRequestBody(createDogSchema),
  createDogHandler
);

dogsRoute.put(
  "/:id",
  verifyToken,
  upload.fields([{ name: "media", maxCount: 10 }]),
  validateRequestBody(createDogSchema.partial()),
  updateDogHandler
);

dogsRoute.delete("/:id", verifyToken, deleteDogHandler);

export default dogsRoute;
