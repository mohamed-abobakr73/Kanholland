import { Router } from "express";
import {
  getAccessTokenHandler,
  getCurrentUserHandler,
  loginHandler,
} from "../controllers/authController.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { loginSchema, getAccessTokenSchema } from "../schemas/loginSchema.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/me", verifyToken, getCurrentUserHandler);

router.post(
  "/refresh-token",
  validateRequestBody(getAccessTokenSchema),
  getAccessTokenHandler
);

router.post("/login", validateRequestBody(loginSchema), loginHandler);

export default router;
