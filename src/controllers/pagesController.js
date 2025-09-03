import * as pageService from "../services/pagesService.js";

export async function createPageHandler(req, res, next) {
  try {
    const userId = req.user?.id || 1; // replace with real auth later

    const body = req.body;

    // Background images
    let backgroundImages = [];
    if (req.files?.backgroundImages) {
      backgroundImages = req.files.backgroundImages.map((file, idx) => ({
        imageUrl: `/uploads/${file.filename}`,
        orderIndex: idx,
      }));
    }

    // Section media (map to first section for now, you can expand logic)
    let sections = [];
    if (body.sections) {
      sections = JSON.parse(body.sections).map((section, idx) => ({
        ...section,
        orderIndex: idx,
        media: req.files?.sectionMedia
          ? req.files.sectionMedia.map((file) => ({
              fileName: file.originalname,
              fileUrl: `/uploads/${file.filename}`,
              fileType: file.mimetype,
            }))
          : [],
      }));
    }

    const page = await pageService.createPage(
      { ...body, backgroundImages, sections },
      userId
    );

    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
}

export async function getPageHandler(req, res, next) {
  try {
    const page = await pageService.getPageById(Number(req.params.id));
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function getAllPagesHandler(req, res, next) {
  try {
    const pages = await pageService.getAllPages();
    res.json(pages);
  } catch (err) {
    next(err);
  }
}

export async function updatePageHandler(req, res, next) {
  try {
    const userId = req.user.id;
    const page = await pageService.updatePage(
      Number(req.params.id),
      req.body,
      userId
    );
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function deletePageHandler(req, res, next) {
  try {
    await pageService.deletePage(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
