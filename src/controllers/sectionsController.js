import * as sectionService from "../services/sectionsService.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createSectionHandler = asyncHandler(async (req, res, next) => {
  const data = req.body;

  if (data.content) {
    try {
      data.content = Array.isArray(data.content)
        ? data.content
        : JSON.parse(data.content);
    } catch {
      data.content = [data.content];
    }
  }

  if (req.files?.backgroundImage) {
    data.backgroundImage = req.files.backgroundImage[0];
  }
  if (req.files?.backgroundVideo) {
    data.backgroundVideo = req.files.backgroundVideo[0];
  }

  const mediaFiles = req.files?.media || [];

  const payload = {
    ...data,
    pageId: Number(req.body.pageId),
  };

  const section = await sectionService.createSection(payload, mediaFiles);

  res.status(201).json({
    status: "success",
    message: "Section created successfully",
    data: section,
  });
});

export const getSectionsHandler = asyncHandler(async (req, res, next) => {
  const sections = await sectionService.getSections();
  res.json({ status: "success", data: sections });
});

export const getSectionByIdHandler = asyncHandler(async (req, res, next) => {
  const section = await sectionService.getSectionById(Number(req.params.id));
  if (!section) {
    return res
      .status(404)
      .json({ status: "error", message: "Section not found" });
  }
  res.json({ status: "success", data: section });
});

export const updateSectionHandler = asyncHandler(async (req, res, next) => {
  const data = req.body;

  if (data.content) {
    try {
      data.content = Array.isArray(data.content)
        ? data.content
        : JSON.parse(data.content);
    } catch {
      data.content = [data.content];
    }
  }

  if (req.files?.backgroundImage) {
    data.backgroundImage = req.files?.backgroundImage[0];
  }
  if (req.files?.backgroundVideo) {
    data.backgroundVideo = req.files?.backgroundVideo[0];
  }

  const mediaFiles = req.files?.media || [];

  console.log("media files is", mediaFiles);

  const section = await sectionService.updateSection(Number(req.params.id), {
    ...data,
    mediaFiles,
  });

  res.json({
    status: "success",
    message: "Section updated successfully",
    data: section,
  });
});

export const deleteSectionHandler = asyncHandler(async (req, res, next) => {
  await sectionService.deleteSection(Number(req.params.id));
  res.json({ status: "success", message: "Section deleted" });
});
