import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Please include a valid email")
];

