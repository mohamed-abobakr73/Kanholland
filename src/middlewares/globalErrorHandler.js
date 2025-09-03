import httpStatusText from "../utils/httpStatusText.js";

const globalErrorHandler = async (error, req, res, next) => {
  const errorResponse = {
    status: error.statusText || httpStatusText.ERROR,
    message: error.message || "Something went wrong",
    code: error.statusCode || 500,
    data: null,
  };

  if (error.validationErrors) {
    errorResponse.validationErrors = error.validationErrors;
  }
  res.status(error.statusCode || 500).json(errorResponse);
};

export default globalErrorHandler;
