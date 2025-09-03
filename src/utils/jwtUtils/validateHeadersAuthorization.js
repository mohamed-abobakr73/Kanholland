const validateHeadersAuthorization = (req) => {
  const authHeaders =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeaders) {
    const error = new AppError(
      "No JWT token provided.",
      401,
      httpStatusText.ERROR
    );
    throw error;
  }

  const token = authHeaders.split(" ")[1];
  return token;
};

export default validateHeadersAuthorization;
