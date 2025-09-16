import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createDog,
  getDogs,
  getDogById,
  updateDog,
  deleteDog,
} from "../services/dogsService.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createDogHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const mediaFiles = req.files?.media || [];

  const dog = await createDog(data, mediaFiles);

  res.status(201).json({ success: httpStatusText.SUCCESS, data: dog });
});

export const getDogsHandler = asyncHandler(async (req, res) => {
  const dogs = await getDogs();
  res.json({ success: httpStatusText.SUCCESS, data: dogs });
});

export const getDogByIdHandler = asyncHandler(async (req, res) => {
  const dogId = Number(req.params.id);

  const dog = await getDogById(dogId);

  res.json({ success: httpStatusText.SUCCESS, data: dog });
});

export const updateDogHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const mediaFiles = req.files?.media || [];

  data.mediaFiles = mediaFiles;

  console.log("43_" + data.mediaFiles[0].originalname);

  data.mediaFiles[0].originalname = "43_" + data.mediaFiles[0].originalname;

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
