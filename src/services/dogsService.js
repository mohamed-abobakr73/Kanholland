import prisma from "../config/prismaClient.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import { deleteFileFromS3 } from "../config/multerS3.js";

export const createDog = async (data) => {
  let { media, ...dogData } = data;

  const dog = await prisma.dog.create({
    data: {
      ...dogData,
      ...(Array.isArray(media) && media.length > 0
        ? {
            media: {
              create: media.map((file) => ({
                fileUrl: file.fileUrl,
                fileName: file.fileName,
                mimeType: file.mimeType,
                fileSize: file.fileSize,
                key: file.key,
                bucket: file.bucket,
              })),
            },
          }
        : {}),
    },
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

export const getDogsNames = async () => {
  const dogNames = await prisma.dog.findMany({
    select: {
      name: true,
    },
  });

  return dogNames;
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
  const { media, ...dogData } = data;
  console.log(media);
  const updatedDog = await prisma.dog.update({
    where: { id },
    data: dogData,
  });

  if (!updatedDog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }

  if (Array.isArray(media) && media.length > 0) {
    await Promise.all(
      media.map(async (file) => {
        const fileName = file.fileName.split("_")[1];
        const mediaId = file.fileName.split("_")[0];

        if (mediaId && !isNaN(mediaId)) {
          // Update existing media
          const oldMedia = await prisma.media.findUnique({
            where: { id: Number(mediaId) },
            select: { key: true },
          });

          const updatedMedia = await prisma.media.update({
            // Added await
            where: { id: Number(mediaId) },
            data: file,
          });

          // Delete old file
          if (oldMedia?.key) {
            await deleteFileFromS3(oldMedia?.key);
          }

          return updatedMedia;
        } else {
          // Create new media
          return prisma.media.create({
            data: {
              dogId: id, // Changed from sectionId to dogId
              ...file,
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
