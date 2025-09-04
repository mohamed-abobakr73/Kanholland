import { file } from "zod";
import prisma from "../config/prismaClient.js";

export const createSection = async (data, files = []) => {
  return await prisma.$transaction(async (tx) => {
    const { pageId, title, content, backgroundImage } = data;

    const lastSection = await prisma.section.findFirst({
      where: { pageId },
      orderBy: { orderIndex: "desc" },
    });

    const nextOrderIndex = lastSection ? lastSection.orderIndex + 1 : 1;

    const section = await tx.section.create({
      data: {
        pageId: data.pageId,
        title,
        content,
        orderIndex: nextOrderIndex,
      },
    });

    if (backgroundImage) {
      await tx.background_Image.create({
        data: { ...backgroundImage },
      });
    }

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.filename;

        await tx.media.create({
          data: {
            fileUrl: `/uploads/${fileName}`,
            fileName,
            mimeType: file.mimetype,
            fileSize: file.size,
            uploadedAt: new Date(),
          },
        });
      }
    }

    return await tx.section.findUnique({
      where: { id: section.id },
      include: {
        media: true,
        backgroundImage: true,
      },
    });
  });
};

export const getSections = async () => {
  return await prisma.section.findMany({
    include: { media: { include: { media: true } }, page: true },
  });
};

export const getSectionById = async (id) => {
  return await prisma.section.findUnique({
    where: { id },
    include: { media: { include: { media: true } }, page: true },
  });
};

export const updateSection = async (id, data, mediaFiles = []) => {
  return await prisma.$transaction(async (tx) => {
    const section = await tx.section.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        backgroundVideo: data.backgroundVideo,
        orderIndex: data.orderIndex ?? 0,
        updatedAt: new Date(),
      },
    });

    if (data.backgroundImage) {
      await tx.background_Image.deleteMany({ where: { sectionId: id } });
      await tx.background_Image.create({
        data: { ...data.backgroundImage },
      });
    }

    if (mediaFiles.length > 0) {
    }

    // Return with relations
    return await tx.section.findUnique({
      where: { id: section.id },
      include: {
        media: {
          include: { media: true },
        },
      },
    });
  });
};

export const deleteSection = async (id) => {
  return await prisma.section.delete({ where: { id } });
};
