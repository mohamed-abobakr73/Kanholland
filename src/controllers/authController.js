import asyncHandler from "../middlewares/asyncHandler.js";
import { loginUser } from "../services/authService.js";

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
