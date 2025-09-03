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

    await tx.background_Image.create({
      data: { ...backgroundImage },
    });

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
    // Update section itself
    const section = await tx.section.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        backgroundImage: data.backgroundImage,
        backgroundVideo: data.backgroundVideo,
        orderIndex: data.orderIndex ?? 0,
        updatedAt: new Date(),
      },
    });

    // Handle media files (array of objects)
    if (mediaFiles.length > 0) {
      // 🔥 remove old media links
      await tx.sectionMedia.deleteMany({
        where: { sectionId: section.id },
      });

      // Create new media entries
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const media = await tx.media.create({
          data: {
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.filename,
            mimeType: file.mimetype,
            fileSize: file.size ?? null,
            uploadedAt: new Date(),
          },
        });

        // Link section ↔ media
        await tx.sectionMedia.create({
          data: {
            sectionId: section.id,
            mediaId: media.id,
            orderIndex: i,
          },
        });
      }
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
