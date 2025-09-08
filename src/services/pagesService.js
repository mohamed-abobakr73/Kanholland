import prisma from "../config/prismaClient.js";
import fs from "fs";
import path from "path";

export async function createPage(data, userId) {
  return await prisma.page.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      backgroundVideoUrl: data.backgroundVideoUrl,
      ...(data.backgroundImage && {
        backgroundImage: {
          create: {
            fileUrl: `/uploads/${data.backgroundImage.filename}`,
            fileName: data.backgroundImage.filename,
            mimeType: data.backgroundImage.mimetype,
            fileSize: data.backgroundImage.size,
          },
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

function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;
  const oldFilePath = path.join(process.cwd(), fileUrl.replace(/^\//, ""));
  fs.unlink(oldFilePath, (err) => {
    if (err) console.error("Failed to delete file:", err);
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
        select: { fileUrl: true },
      });

      updateData.backgroundImage = { delete: true };

      deleteFileIfExists(oldBg?.fileUrl);
    } else if (data.backgroundImage) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { pageId: id },
        select: { fileUrl: true },
      });

      updateData.backgroundImage = {
        upsert: {
          create: {
            fileUrl: `/uploads/${data.backgroundImage.filename}`,
            fileName: data.backgroundImage.filename,
            mimeType: data.backgroundImage.mimetype,
            fileSize: data.backgroundImage.size,
          },
          update: {
            fileUrl: `/uploads/${data.backgroundImage.filename}`,
            fileName: data.backgroundImage.filename,
            mimeType: data.backgroundImage.mimetype,
            fileSize: data.backgroundImage.size,
          },
        },
      };

      deleteFileIfExists(oldBg?.fileUrl);
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
