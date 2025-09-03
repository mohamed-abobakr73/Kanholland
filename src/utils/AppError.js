import httpStatusText from "./httpStatusText.js";

class GlobalError extends Error {
  message;
  statusCode;
  statusText;
  validationErrors;
  constructor(message, statusCode, statusText, validationErrors) {
    super();
    this.message = message || "Something went wrong";
    this.statusCode = statusCode || 500;
    this.statusText = statusText || httpStatusText.ERROR;
    this.validationErrors = validationErrors;
    return this;
  }
}

export default GlobalError;
