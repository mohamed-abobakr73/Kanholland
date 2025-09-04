import * as pageService from "../services/pagesService.js";

export async function createPageHandler(req, res, next) {
  try {
    const userId = req.user?.id || 1;

    const data = req.body;

    if (req.file) {
      data.backgroundImage = req.file;
    }

    const page = await pageService.createPage(data, userId);

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
    // const userId = req.user.id;
    const data = req.body
    if (req.file) {
      data.backgroundImage = req.file;
    }

    const page = await pageService.updatePage(Number(req.params.id), data, 1);

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
