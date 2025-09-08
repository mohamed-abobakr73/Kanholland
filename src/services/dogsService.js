import prisma from "../config/prismaClient.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createDog = async (data) => {
  const dog = await prisma.dog.create({
    data,
    profileImage: {
      create: {
        fileUrl: `/uploads/${data.profileImage.filename}`,
        fileName: data.profileImage.filename,
        mimeType: data.profileImage.mimetype,
        fileSize: data.profileImage.size,
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
    include: { profileImage: true, media: true, trainingPrograms: true },
  });

  return dogs;
};

export const getDogById = async (id) => {
  const dog = await prisma.dog.findUnique({
    where: { id },
    include: { profileImage: true, media: true, trainingPrograms: true },
  });

  if (!dog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }

  return dog;
};

export const updateDog = async (id, data) => {
  const updatedDog = await prisma.dog.update({
    where: { id },
    data,
  });

  if (!updatedDog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }

  return updatedDog;
};

export const deleteDog = async (id) => {
  const deletedDog = await prisma.dog.delete({
    where: { id },
  });

  if (!deletedDog) {
    throw new AppError("Dog not found", 404, httpStatusText.NOT_FOUND);
  }
};
