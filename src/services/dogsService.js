import prisma from "../config/prismaClient.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import path from "path";
import fs from "fs";

export const createDog = async (data, files = []) => {
  const createData = {
    ...data,
  };

  // Add media relation if files exist
  if (files.length > 0) {
    createData.media = {
      create: files.map((file) => ({
        fileUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: data.userId ?? null,
      })),
    };
  }

  const dog = await prisma.dog.create({
    data: createData,
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
    },
  });

  if (!dog) {
    throw new AppError("Dog not created", 400, httpStatusText.BAD_REQUEST);
  }
  return dog;
};

export const getDogs = async () => {
  const dogs = await prisma.dog.findMany({
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
    },
  });

  return dogs;
};

export const getDogById = async (id) => {
  const dog = await prisma.dog.findUnique({
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
    },
  });

  if (!dog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }

  return dog;
};

export const updateDog = async (id, data) => {
  // Remove mediaFiles from data before updating the dog
  const { mediaFiles, ...dogData } = data;

  const updatedDog = await prisma.dog.update({
    where: { id },
    data: dogData, // Use dogData without mediaFiles
  });

  if (!updatedDog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }

  if (mediaFiles && mediaFiles.length > 0) {
    await Promise.all(
      mediaFiles.map(async (file) => {
        const fileName = file.originalname.split("_")[1];
        const mediaId = file.originalname.split("_")[0];

        if (mediaId && !isNaN(mediaId)) {
          // Update existing media
          const oldMedia = await prisma.media.findUnique({
            where: { id: Number(mediaId) },
            select: { fileUrl: true },
          });

          const updatedMedia = await prisma.media.update({
            // Added await
            where: { id: Number(mediaId) },
            data: {
              fileUrl: `/uploads/${file.filename}`,
              fileName: file.originalname,
              mimeType: file.mimetype,
              fileSize: file.size,
            },
          });

          // Delete old file
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
          // Create new media
          return prisma.media.create({
            data: {
              dogId: id, // Changed from sectionId to dogId
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

  // Return updated dog with media
  return await prisma.dog.findUnique({
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
    },
  });
};

export const deleteDog = async (id) => {
  const deletedDog = await prisma.dog.delete({
    where: { id },
  });

  if (!deletedDog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }
};
