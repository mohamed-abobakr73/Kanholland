import httpStatusText from "../utils/httpStatusText.js";
import { fromZodError } from "zod-validation-error";
import AppError from "../utils/AppError.js";

const validateRequestBody = (schema) => {
  return (req, res, next) => {
    const parsedRequestBody = schema.safeParse(req.body);
    if (!parsedRequestBody.success) {
      const error = new AppError(
        "Validation error",
        400,
        httpStatusText.FAIL,
        fromZodError(parsedRequestBody.error).details.map(
          (error) => error.message
        )
      );
      next(error);
    }
    req.validatedData = parsedRequestBody.data;
    next();
  };
};

export { validateRequestBody };
