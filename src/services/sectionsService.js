import prisma from "../config/prismaClient.js";
import { deleteFileFromS3 } from "../config/multerS3.js";

export const createSection = async (data) => {
  try {
    const lastSection = await prisma.section.findFirst({
      where: { pageId: data.pageId },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });

    const nextOrderIndex = lastSection ? lastSection.orderIndex + 1 : 1;

    return await prisma.section.create({
      data: {
        title: data.title,
        content: data.content,
        backgroundVideo: data.backgroundVideo,
        orderIndex: nextOrderIndex,
        pageId: data.pageId,

        ...(data.backgroundImage && {
          backgroundImage: {
            create: data.backgroundImage,
          },
        }),

        ...(Array.isArray(data.media) &&
          data.media.length > 0 && {
            media: {
              create: data.media.map((file) => file),
            },
          }),
      },
      include: {
        backgroundImage: true,
        media: true,
      },
    });
  } catch (error) {
    await deleteFileFromS3(data.backgroundImage.key);
    throw error;
  }
};

export const getSections = async () => {
  return await prisma.section.findMany({
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
  });
};

export const getSectionById = async (id) => {
  return await prisma.section.findUnique({
    where: { id },
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
  });
};

export async function updateSection(id, data) {
  const existingSectionContent = await prisma.section.findUnique({
    where: { id },
    select: { content: true },
  });

  let updatedContent = existingSectionContent?.content ?? [];

  if (Array.isArray(data.content)) {
    for (const update of data.content) {
      if (
        typeof update.index === "number" &&
        typeof update.value === "string"
      ) {
        updatedContent[update.index] = update.value;
      }
    }
  }

  const updateData = {
    title: data.title,
    content: updatedContent,
    backgroundVideo: data.backgroundVideo,
  };

  if ("backgroundImage" in data) {
    if (data.backgroundImage === null) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { sectionId: id },
        select: { key: true },
      });

      updateData.backgroundImage = { delete: true };

      if (oldBg?.key) {
        await deleteFileFromS3(oldBg?.key);
      }
    } else if (data.backgroundImage) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { sectionId: id },
        select: { key: true },
      });
      console.log(data.backgroundImage);
      updateData.backgroundImage = {
        upsert: {
          create: data.backgroundImage,
          update: data.backgroundImage,
        },
      };

      if (oldBg?.key) {
        await deleteFileFromS3(oldBg?.key);
      }
    }
  }

  const section = await prisma.section.update({
    where: { id },
    data: updateData,
    include: {
      backgroundImage: true,
      media: {
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

  if (Array.isArray(data.media) && data.media.length > 0) {
    await Promise.all(
      data.media.map(async (file) => {
        const fileName = file.fileName.split("_")[1];
        const mediaId = file.fileName.split("_")[0];

        if (mediaId && !isNaN(mediaId)) {
          const oldMedia = await prisma.media.findUnique({
            where: { id: Number(mediaId) },
            select: { key: true },
          });

          const updatedMedia = prisma.media.update({
            where: { id: Number(mediaId) },
            data: file,
          });

          if (oldMedia?.key) {
            await deleteFileFromS3(oldMedia?.key);
          }

          return updatedMedia;
        } else {
          return prisma.media.create({
            data: { sectionId: id, ...file },
          });
        }
      })
    );
  }

  return await prisma.section.findUnique({
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
      media: {
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

export const deleteSection = async (id) => {
  return await prisma.section.delete({ where: { id } });
};
