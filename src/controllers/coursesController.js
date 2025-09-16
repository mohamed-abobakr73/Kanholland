import asyncHandler from "../middlewares/asyncHandler.js";
import * as courseService from "../services/coursesService.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createCourseHandler = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Course created successfully",
    data: course,
  });
});

export const getAllCoursesHandler = asyncHandler(async (req, res) => {
  const courses = await courseService.getAllCourses();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Courses retrieved successfully",
    data: courses,
  });
});

export const getCourseByIdHandler = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(Number(req.params.id));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Course retrieved successfully",
    data: course,
  });
});

export const updateCourseHandler = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(
    Number(req.params.id),
    req.body
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Course updated successfully",
    data: course,
  });
});
