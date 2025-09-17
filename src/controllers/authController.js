import asyncHandler from "../middlewares/asyncHandler.js";
import {
  getAccessToken,
  loginUser,
  getCurrentUser,
  createAdmin,
  forgetPassword,
  resetPassword,
} from "../services/authService.js";
import httpStatusText from "../utils/httpStatusText.js";

export const forgetPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgetPassword(email);
  return res.json({
    status: httpStatusText.SUCCESS,
    message: `Password reset url sent successfully to ${email}`,
  });
});

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const user = await resetPassword(data);
  res.json({ status: httpStatusText.SUCCESS, data: { user } });
});

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

export const createAdminHandler = asyncHandler(async (req, res) => {
  const result = await createAdmin(req.body);
  return res.json(result);
});

export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return res.json(result);
});
