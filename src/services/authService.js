import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import { configDotenv } from "dotenv";
import generateJwt from "../utils/jwtUtils/generateJwt.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

configDotenv();

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });
  return user;
};

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

export const createAdmin = async (data) => {
  const passwordHash = await bcrypt.hash(data.password, 10);

  delete data.password;

  const user = await prisma.user.create({
    data: {
      ...data,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  return user;
};

export const forgetPassword = async (email) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new AppError("User not found", 404, httpStatusText.FAIL);
    }

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const jwtToken = jwt.sign(
      {
        email: email,
        resetToken: resetToken,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `https://kanholland.aydnlabs.com/dashboard/reset-password?token=${jwtToken}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 15 minutes.</strong></p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 12px;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Kanholland - Password Reset Request",
      html: emailHtml,
    });
  } catch (error) {
    throw new AppError(error.message, 500, httpStatusText.FAIL);
  }
};

export const resetPassword = async (data) => {
  const { email, token, newPassword, confirmPassword } = data;

  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, email: true, username: true },
  });
  if (!user) {
    throw new AppError("User not found", 404, httpStatusText.FAIL);
  }

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new AppError(
      "Invalid reset password token",
      401,
      httpStatusText.FAIL
    );
  }

  if (!decodedToken) {
    throw new AppError(
      "Invalid reset password token",
      401,
      httpStatusText.FAIL
    );
  }

  if (decodedToken.email !== email) {
    throw new AppError(
      "Invalid reset password token",
      401,
      httpStatusText.FAIL
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("Passwords do not match", 400, httpStatusText.FAIL);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  return user;
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
