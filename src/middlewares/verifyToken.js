import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import AppError from "../utils/AppError.js";
import { validateHeadersAuthorization } from "../utils/jwtUtils/index.js";

const verifyToken = (req, res, next) => {
  try {
    const token = validateHeadersAuthorization(req);

    const JWT_SECRET_KEY = process.env.JWT_SECRET;

    const currentUser = jwt.verify(token, JWT_SECRET_KEY);

    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = new AppError("Invalid JWT token.", 401, httpStatusText.ERROR);
    return next(error);
  }
};

export default verifyToken;
