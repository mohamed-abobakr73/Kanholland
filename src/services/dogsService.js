import prisma from "../prisma/client.js";

export const createDog = async (data) => {
  return await prisma.dog.create({ data });
};

export const getDogs = async () => {
  return await prisma.dog.findMany({
    include: { profileImage: true, media: true, trainingPrograms: true },
  });
};

export const getDogById = async (id) => {
  return await prisma.dog.findUnique({
    where: { id },
    include: { profileImage: true, media: true, trainingPrograms: true },
  });
};

export const updateDog = async (id, data) => {
  return await prisma.dog.update({
    where: { id },
    data,
  });
};

export const deleteDog = async (id) => {
  return await prisma.dog.delete({
    where: { id },
  });
};
