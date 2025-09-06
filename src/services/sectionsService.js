import prisma from "../config/prismaClient.js";
import fs from "fs";
import path from "path";

export const createSection = async (data, files = []) => {
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
          create: {
            fileUrl: `/uploads/${data.backgroundImage.filename}`,
            fileName: data.backgroundImage.filename,
            mimeType: data.backgroundImage.mimetype,
            fileSize: data.backgroundImage.size,
          },
        },
      }),

      ...(files.length > 0 && {
        media: {
          create: files.map((file) => ({
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            uploadedBy: data.userId ?? null,
          })),
        },
      }),
    },
    include: {
      backgroundImage: true,
      media: true,
    },
  });
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
        select: { fileUrl: true },
      });

      updateData.backgroundImage = { delete: true };

      if (oldBg?.fileUrl) {
        const oldFilePath = path.join(
          process.cwd(),
          oldBg.fileUrl.replace(/^\//, "")
        );
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Failed to delete old background image:", err);
        });
      }
    } else if (data.backgroundImage) {
      const oldBg = await prisma.background_Image.findUnique({
        where: { sectionId: id },
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

      if (oldBg?.fileUrl) {
        const oldFilePath = path.join(
          process.cwd(),
          oldBg.fileUrl.replace(/^\//, "")
        );
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Failed to delete old background image:", err);
        });
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

  if (data.mediaFiles.length > 0) {
    await Promise.all(
      data.mediaFiles.map(async (file) => {
        if (file.mediaId) {
          const oldMedia = await prisma.media.findUnique({
            where: { id: Number(file.mediaId) },
            select: { fileUrl: true },
          });

          const updatedMedia = prisma.media.update({
            where: { id: Number(file.mediaId) },
            data: {
              fileUrl: `/uploads/${file.filename}`,
              fileName: file.originalname,
              mimeType: file.mimetype,
              fileSize: file.size,
            },
          });

          if (oldMedia?.fileUrl) {
            const oldFilePath = path.join(
              process.cwd(),
              oldMedia.fileUrl.replace(/^\//, "")
            );

            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Failed to delete old media file:", err);
              }
            });
          }

          return updatedMedia;
        } else {
          return prisma.media.create({
            data: {
              sectionId: id,
              fileUrl: `/uploads/${file.filename}`,
              fileName: file.originalname,
              mimeType: file.mimetype,
              fileSize: file.size,
              uploadedBy: data.userId ?? null,
            },
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
