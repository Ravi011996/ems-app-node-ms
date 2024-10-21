import express from "express";
import { AuthController } from "../controllers/index";
import { registerValidation } from "../validators/authValidator";
import { loginValidation } from "../validators/loginValidator";
import { validateResult } from "../middlewares/index";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateResult,
  AuthController.register
);

router.post("/login", AuthController.login);

export default router;
