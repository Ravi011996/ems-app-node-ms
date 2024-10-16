import express from "express";
import AuthController from "../controllers/authController";
import { registerValidation } from "../validators/authValidator";
import { loginValidation } from "../validators/loginValidator";
import { validateResult } from "../middlewares/validateResult";

const router = express.Router();

router.post("/register", registerValidation, validateResult, AuthController.register);

router.post("/login", loginValidation, AuthController.login);

export default router;
