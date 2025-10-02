import prisma from "../config/prismaClient.js";
import fs from "fs";
import path from "path";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import { deleteFileFromS3 } from "../config/multerS3.js";

export async function createPage(data, userId) {
  const pageExists = await prisma.page.findUnique({
    where: { slug: data.slug },
  });
  if (pageExists) {
    throw new AppError("Page already exists", 400, httpStatusText.FAIL);
  }

  return await prisma.page.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      backgroundVideoUrl: data.backgroundVideoUrl,
      ...(data.backgroundImage && {
        backgroundImage: {
          create: data.backgroundImage,
        },
      }),
    },
    include: {
      backgroundImage: {
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
        },
      },
    },
  });
}

export async function getPageById(id) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      backgroundImage: {
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
        },
      },
      sections: {
        include: {
          media: {
            select: {
              id: true,
              fileUrl: true,
              fileName: true,
              mimeType: true,
              fileSize: true,
            },
          },
          backgroundImage: {
            select: {
              id: true,
              fileUrl: true,
              fileName: true,
              mimeType: true,
              fileSize: true,
            },
          },
        },
      },
    },
  });
}

export async function getAllPages() {
  return await prisma.page.findMany({
    include: {
      backgroundImage: {
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
        },
      },
      sections: {
        include: {
          media: {
            select: {
              id: true,
              fileUrl: true,
              fileName: true,
              mimeType: true,
              fileSize: true,
            },
          },
          backgroundImage: {
            select: {
              id: true,
              fileUrl: true,
              fileName: true,
              mimeType: true,
              fileSize: true,
            },
          },
        },
      },
    },
  });
}

export async function updatePage(id, data, userId) {
  let updateData = {};

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;

  if ("backgroundImage" in data) {
    if (data.backgroundImage === null) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { pageId: id },
        select: { key: true },
      });

      updateData.backgroundImage = { delete: true };

      await deleteFileFromS3(oldBg?.key);
    } else if (data.backgroundImage) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { pageId: id },
        select: { key: true },
      });

      updateData.backgroundImage = {
        upsert: {
          create: data.backgroundImage,
          update: data.backgroundImage,
        },
      };

      console.log(oldBg?.key);
      await deleteFileFromS3(oldBg?.key);
    }
  }

  return await prisma.page.update({
    where: { id },
    data: updateData,
    include: {
      backgroundImage: {
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
        },
      },
    },
  });
}

export async function deletePage(id) {
  return prisma.page.delete({ where: { id } });
}
