import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createDog,
  getDogs,
  getDogById,
  updateDog,
  deleteDog,
  getDogsNames,
} from "../services/dogsService.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createDogHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const mediaFiles = req.files?.media || [];

  if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
    data.media = mediaFiles.map((file) => ({
      fileUrl: file.location,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      key: file.key,
    }));
  }

  const dog = await createDog(data);

  res.status(201).json({ success: httpStatusText.SUCCESS, data: dog });
});

export const getDogsHandler = asyncHandler(async (req, res) => {
  const dogs = await getDogs();
  res.json({ success: httpStatusText.SUCCESS, data: dogs });
});

export const getDogsNamesHandler = asyncHandler(async (req, res) => {
  const dogsNames = await getDogsNames();
  res.json({ success: httpStatusText.SUCCESS, data: dogsNames });
});

export const getDogByIdHandler = asyncHandler(async (req, res) => {
  const dogId = Number(req.params.id);

  const dog = await getDogById(dogId);

  res.json({ success: httpStatusText.SUCCESS, data: dog });
});

export const updateDogHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const mediaFiles = req.files?.media || [];

  if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
    data.media = mediaFiles.map((file) => ({
      fileUrl: file.location,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      key: file.key,
    }));
  }

  const dog = await updateDog(Number(req.params.id), data);
  res.json({ success: httpStatusText.SUCCESS, data: dog });
});

export const deleteDogHandler = asyncHandler(async (req, res) => {
  await deleteDog(Number(req.params.id));
  res.json({
    success: httpStatusText.SUCCESS,
    message: "Dog deleted successfully",
  });
});
