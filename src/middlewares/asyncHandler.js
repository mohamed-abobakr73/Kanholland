const asyncHandler = (asyncFunc) => {
  return async (req, res, next) => {
    asyncFunc(req, res, next).catch((error) => next(error));
  };
};

export default asyncHandler;
