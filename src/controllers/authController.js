import asyncHandler from "../middlewares/asyncHandler.js";
import {
  getAccessToken,
  loginUser,
  getCurrentUser,
} from "../services/authService.js";

export const getCurrentUserHandler = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const result = await getCurrentUser(userId);
  return res.json(result);
});

export const getAccessTokenHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await getAccessToken(refreshToken);
  return res.json(result);
});

export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return res.json(result);
});
