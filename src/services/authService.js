import prisma from "../config/prismaClient.js"; // your prisma client wrapper
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    token,
    expiresAtUtc: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    refreshToken,
    refreshTokenExpiresAtUtc: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
}
