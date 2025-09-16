import prisma from "../config/prismaClient.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createCourse = async (data) => {
  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      note: data.note || null,
      topics: data.topics,
      advancedTopics: data.advancedTopics,
      createdBy: data.createdBy,
    },
  });

  if (!course) {
    throw new AppError("Course not created", 400, httpStatusText.BAD_REQUEST);
  }

  return course;
};

export const getAllCourses = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;

  const whereCondition = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where: whereCondition,
      skip: skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where: whereCondition }),
  ]);

  return {
    courses,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNext: skip + limit < totalCount,
      hasPrev: page > 1,
    },
  };
};

// READ - Get course by ID
export const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });

  if (!course) {
    throw new AppError("Course not found", 404, httpStatusText.NOT_FOUND);
  }

  return course;
};
// UPDATE - Update course
export const updateCourse = async (id, data) => {
  try {
    // First, get the existing course
    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCourse) {
      throw new AppError("Course not found", 404, httpStatusText.NOT_FOUND);
    }

    // Handle topics update
    let updatedTopics = existingCourse.topics ?? [];
    if (Array.isArray(data.topics)) {
      for (const update of data.topics) {
        if (typeof update.value !== "undefined") {
          if (typeof update.index === "number") {
            // Update at specific index
            updatedTopics[update.index] = update.value;
          } else {
            console.log(update.value);
            // No index provided, add to end
            updatedTopics.push(update.value);
          }
        }
      }
    }

    // Handle advancedTopics update
    let updatedAdvancedTopics = existingCourse.advancedTopics ?? [];
    if (Array.isArray(data.advancedTopics)) {
      for (const update of data.advancedTopics) {
        if (typeof update.value !== "undefined") {
          if (typeof update.index === "number") {
            // Update at specific index
            updatedAdvancedTopics[update.index] = update.value;
          } else {
            // No index provided, add to end
            updatedAdvancedTopics.push(update.value);
          }
        }
      }
    }

    // Prepare update data
    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.note !== undefined) updateData.note = data.note;
    if (data.createdBy !== undefined) updateData.createdBy = data.createdBy;

    updateData.topics = updatedTopics;
    updateData.advancedTopics = updatedAdvancedTopics;

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return updatedCourse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update course", 500, httpStatusText.ERROR);
  }
};
