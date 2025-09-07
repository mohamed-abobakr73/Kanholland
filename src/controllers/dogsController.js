import asyncHandler from "../utils/asyncHandler.js";
import {
  createDog,
  getDogs,
  getDogById,
  updateDog,
  deleteDog,
} from "../services/dogsService.js";
import httpStatusText from "../utils/httpStatusText.js";

export const createDogHandler = asyncHandler(async (req, res) => {
  const dog = await createDog(req.body);
  res.status(201).json({ success: httpStatusText.SUCCESS, data: dog });
});

export const getDogsHandler = asyncHandler(async (req, res) => {
  const dogs = await getDogs();
  res.json({ success: httpStatusText.SUCCESS, data: dogs });
});

export const getDogByIdHandler = asyncHandler(async (req, res) => {
  const dog = await getDogById(Number(req.params.id));
  res.json({ success: httpStatusText.SUCCESS, data: dog });
});

export const updateDogHandler = asyncHandler(async (req, res) => {
  const dog = await updateDog(Number(req.params.id), req.body);
  res.json({ success: httpStatusText.SUCCESS, data: dog });
});

export const deleteDogHandler = asyncHandler(async (req, res) => {
  await deleteDog(Number(req.params.id));
  res.json({
    success: httpStatusText.SUCCESS,
    message: "Dog deleted successfully",
  });
});
