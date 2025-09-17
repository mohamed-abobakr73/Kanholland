import { Router } from "express";
import {
  createAdminHandler,
  forgetPasswordHandler,
  getAccessTokenHandler,
  getCurrentUserHandler,
  loginHandler,
  resetPasswordHandler,
} from "../controllers/authController.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import {
  loginSchema,
  getAccessTokenSchema,
  createAdminSchema,
} from "../schemas/authSchema.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/me", verifyToken, getCurrentUserHandler);

router.post(
  "/refresh-token",
  validateRequestBody(getAccessTokenSchema),
  getAccessTokenHandler
);

router.post(
  "/forget-password",
  // validateRequestBody(getAccessTokenSchema),
  forgetPasswordHandler
);

router.post(
  "/reset-password",
  // validateRequestBody(getAccessTokenSchema),
  resetPasswordHandler
);

router.post(
  "/create-admin",
  verifyToken,
  validateRequestBody(createAdminSchema),
  createAdminHandler
);

router.post("/login", validateRequestBody(loginSchema), loginHandler);

export default router;
