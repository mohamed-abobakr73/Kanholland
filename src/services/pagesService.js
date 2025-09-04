import { BackgroundImageEntityType } from "@prisma/client";
import prisma from "../config/prismaClient.js";

export async function createPage(data, userId) {
  const page = await prisma.page.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      backgroundVideoUrl: data.backgroundVideoUrl,
    },
  });

  if (data.backgroundImage) {
    const imageData = {
      fileUrl: `/uploads/${data.backgroundImage.filename}`,
      fileName: data.backgroundImage.filename,
      mimeType: data.backgroundImage.mimetype,
      fileSize: data.backgroundImage.size,
      entityId: page.id,
      entityType: BackgroundImageEntityType.PAGE,
    };
    await prisma.background_Image.create({
      data: imageData,
    });
  }

  const backgroundImage = await prisma.background_Image.findFirst({
    where: {
      entityType: "PAGE",
      entityId: page.id,
    },
  });

  return { ...page, backgroundImage };
}

export async function getPageById(id) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      backgroundImage: true,
      sections: { include: { media: true } },
    },
  });
}

export async function getAllPages() {
  const pages = await prisma.page.findMany({});

  const pagesWithImages = await Promise.all(
    pages.map(async (page) => {
      const backgroundImage = await prisma.background_Image.findFirst({
        where: {
          entityType: "PAGE",
          entityId: page.id,
        },
        select: {
          id: true,
          fileUrl: true,
          fileName: true,
          fileSize: true,
          mimeType: true,
        },
      });

      return {
        ...page,
        backgroundImage,
      };
    })
  );

  return pagesWithImages;
}

export async function updatePage(id, data, userId) {
  if (data.backgroundImage) {
    await prisma.background_Image.deleteMany({ where: { entityId: id } });
    const imageData = {
      fileUrl: `/uploads/${data.backgroundImage.filename}`,
      fileName: data.backgroundImage.filename,
      mimeType: data.backgroundImage.mimetype,
      fileSize: data.backgroundImage.size,
      entityId: id,
      entityType: BackgroundImageEntityType.PAGE,
    };

    await prisma.background_Image.create({
      data: imageData,
    });
  }

  delete data.backgroundImage;

  const page = await prisma.page.update({
    where: { id },
    data: {
      ...data,
    },
  });

  const backgroundImage = await prisma.background_Image.findFirst({
    where: {
      entityType: "PAGE",
      entityId: page.id,
    },
  });

  return { ...page, backgroundImage };
}

export async function deletePage(id) {
  return prisma.page.delete({ where: { id } });
}
