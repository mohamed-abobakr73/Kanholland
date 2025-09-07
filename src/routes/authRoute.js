import { Router } from "express";
import {
  getAccessTokenHandler,
  loginHandler,
} from "../controllers/authController.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { loginSchema, getAccessTokenSchema } from "../schemas/loginSchema.js";

const router = Router();

router.post(
  "/refresh-token",
  validateRequestBody(getAccessTokenSchema),
  getAccessTokenHandler
);
router.post("/login", validateRequestBody(loginSchema), loginHandler);

export default router;
