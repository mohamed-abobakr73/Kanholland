import prisma from "../config/prismaClient.js";

export const createSection = async (data, files = []) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the section with background only
    const lastSection = await prisma.section.findFirst({
      where: { pageId: data.pageId },
      orderBy: { orderIndex: "desc" },
    });

    // 2. Calculate next orderIndex
    const nextOrderIndex = lastSection ? lastSection.orderIndex + 1 : 1;

    const section = await tx.section.create({
      data: {
        pageId: data.pageId,
        title: data.title,
        content: data.content,
        backgroundImage: data.backgroundImage || null, // keep separate
        backgroundVideo: data.backgroundVideo || null,
        orderIndex: nextOrderIndex || 0,
      },
    });

    // 2. Handle media[] (multiple uploads)
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.filename;

        const media = await tx.media.create({
          data: {
            fileUrl: `/uploads/${fileName}`,
            fileName,
            mimeType: file.mimetype,
            fileSize: file.size,
            uploadedAt: new Date(),
          },
        });

        await tx.sectionMedia.create({
          data: {
            sectionId: section.id,
            mediaId: media.id,
            orderIndex: i,
          },
        });
      }
    }

    // 3. Return with media included
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

export const getSections = async () => {
  return await prisma.section.findMany({
    include: { media: {include: {media: true}}, page: true },
  });
};

export const getSectionById = async (id) => {
  return await prisma.section.findUnique({
    where: { id },
    include: { media: {include: {media: true}}, page: true },
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
