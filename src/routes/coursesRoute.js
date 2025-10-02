import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createCourseHandler,
  getAllCoursesHandler,
  getCourseByIdHandler,
  updateCourseHandler,
} from "../controllers/coursesController.js";

const coursesRoute = Router();

coursesRoute.get("/", getAllCoursesHandler);

coursesRoute.get("/:id", getCourseByIdHandler);

coursesRoute.post("/", verifyToken, createCourseHandler);

coursesRoute.put("/:id", verifyToken, updateCourseHandler);

export default coursesRoute;
