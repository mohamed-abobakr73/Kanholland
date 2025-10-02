import * as pageService from "../services/pagesService.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createPageHandler = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id || 1;

  const data = req.body;

  if (req.file) {
    data.backgroundImage = {
      fileUrl: req.file.location,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      key: req.file.key,
    };
  }

  console.log(data.backgroundImage);

  const page = await pageService.createPage(data, userId);

  res.status(201).json(page);
});

export const getPageHandler = asyncHandler(async (req, res, next) => {
  const page = await pageService.getPageById(Number(req.params.id));
  if (!page) return res.status(404).json({ message: "Page not found" });
  res.json(page);
});

export const getAllPagesHandler = asyncHandler(async (req, res, next) => {
  const pages = await pageService.getAllPages();
  res.json(pages);
});

export const updatePageHandler = asyncHandler(async (req, res, next) => {
  const data = req.body;

  if (req.files?.backgroundImage) {
    const file = req.files.backgroundImage[0];
    data.backgroundImage = {
      fileUrl: file.location,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      key: file.key,
    };
  }

  if (req.files?.backgroundVideo) {
    data.backgroundVideo = req.files?.backgroundVideo[0];
  }

  console.log(data);

  const page = await pageService.updatePage(Number(req.params.id), data, 1);

  res.json(page);
});

export const deletePageHandler = asyncHandler(async (req, res, next) => {
  await pageService.deletePage(Number(req.params.id));
  res.status(204).send();
});
