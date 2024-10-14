import express from "express";
import { register, login } from "../controllers/authController";
import { registerValidation } from "../validators/authValidator";
import { loginValidation } from "../validators/loginValidator";
import { validateResult } from "../middlewares/validateResult";

const router = express.Router();

// Register route
router.post("/register", registerValidation, validateResult, register);

// Login route
router.post("/login", loginValidation, login);

export default router;
