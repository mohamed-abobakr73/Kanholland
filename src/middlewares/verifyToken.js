import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import AppError from "../utils/AppError.js";
import { validateHeadersAuthorization } from "../utils/jwtUtils/index.js";
import { configDotenv } from "dotenv";

configDotenv();

const verifyToken = (req, res, next) => {
  try {
    const token = validateHeadersAuthorization(req);

    const JWT_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

    const currentUser = jwt.verify(token, JWT_SECRET_KEY);

    req.user = currentUser;
    next();
  } catch (err) {
    const error = new AppError("Invalid JWT token.", 401, httpStatusText.ERROR);
    return next(error);
  }
};

export default verifyToken;
