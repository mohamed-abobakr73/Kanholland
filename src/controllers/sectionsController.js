import * as sectionService from "../services/sectionsService.js";

export const createSectionHandler = async (req, res, next) => {
  try {
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
      data.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`;
    }
    if (req.files?.backgroundVideo) {
      data.backgroundVideo = `/uploads/${req.files.backgroundVideo[0].filename}`;
    }

    console.log(req.files?.backgroundImage);
    console.log(data.backgroundImage);

    const mediaFiles = req.files?.media || [];

    const payload = {
      ...data,
      pageId: Number(req.body.pageId),
      orderIndex: req.body.orderIndex ? Number(req.body.orderIndex) : 0,
    };

    const section = await sectionService.createSection(payload, mediaFiles);

    res.status(201).json({
      status: "success",
      message: "Section created successfully",
      data: section,
    });
  } catch (err) {
    next(err);
  }
};

export const getSectionsHandler = async (req, res, next) => {
  try {
    const sections = await sectionService.getSections();
    res.json({ status: "success", data: sections });
  } catch (err) {
    next(err);
  }
};

export const getSectionByIdHandler = async (req, res, next) => {
  try {
    const section = await sectionService.getSectionById(Number(req.params.id));
    if (!section) {
      return res
        .status(404)
        .json({ status: "error", message: "Section not found" });
    }
    res.json({ status: "success", data: section });
  } catch (err) {
    next(err);
  }
};

export const updateSectionHandler = async (req, res, next) => {
  try {
    const data = req.body;

    // Backgrounds
    if (req.files?.backgroundImage) {
      data.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`;
    }
    if (req.files?.backgroundVideo) {
      data.backgroundVideo = `/uploads/${req.files.backgroundVideo[0].filename}`;
    }

    // Media files (array)
    const mediaFiles = req.files?.media || [];

    const section = await sectionService.updateSection(Number(req.params.id), {
      ...data,
      orderIndex: req.body.orderIndex ? Number(req.body.orderIndex) : 0,
      mediaFiles,
    });

    res.json({
      status: "success",
      message: "Section updated successfully",
      data: section,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSectionHandler = async (req, res, next) => {
  try {
    await sectionService.deleteSection(Number(req.params.id));
    res.json({ status: "success", message: "Section deleted" });
  } catch (err) {
    next(err);
  }
};
