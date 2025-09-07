import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import { configDotenv } from "dotenv";
import generateJwt from "../utils/jwtUtils/generateJwt.js";

configDotenv();

export const getAccessToken = async (refreshToken) => {
  const currentUser = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!currentUser) {
    throw new AppError("Invalid refresh token", 401, httpStatusText.FAIL);
  }

  const tokenPayload = {
    userId: currentUser.id,
    email: currentUser.email,
    username: currentUser.username,
  };

  const token = generateJwt("access", tokenPayload);

  return {
    token,
    expiresAtUtc: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401, httpStatusText.FAIL);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401, httpStatusText.FAIL);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  const token = generateJwt("access", tokenPayload);

  const refreshToken = generateJwt("refresh", tokenPayload);

  return {
    token,
    expiresAtUtc: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    refreshToken,
    refreshTokenExpiresAtUtc: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
};
