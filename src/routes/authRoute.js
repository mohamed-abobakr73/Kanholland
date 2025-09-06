import { Router } from "express";
import { loginHandler } from "../controllers/authController.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import { loginSchema } from "../schemas/loginSchema.js";

const router = Router();

router.post("/login", validateRequestBody(loginSchema), loginHandler);

export default router;
