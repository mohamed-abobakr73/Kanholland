import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

const generateJwt = (tokenType, payload) => {
  const JWT_KEY = "";
  let expiresIn = "";

  if (tokenType === "access") {
    JWT_KEY = process.env.ACCESS_TOKEN_SECRET;
    expiresIn = "30m";
  } else {
    JWT_KEY = process.env.REFRESH_TOKEN_SECRET;
    expiresIn = "14d";
  }

  const token = jwt.sign(payload, JWT_KEY, {
    expiresIn,
  });

  return token;
};

export default generateJwt;
