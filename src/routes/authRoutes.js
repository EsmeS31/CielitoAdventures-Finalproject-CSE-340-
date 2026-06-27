import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  logout,
  register,
  renderLogin,
  renderRegister
} from "../controllers/authController.js";

const router = Router();

const passwordRules = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long.");

router.get("/register", renderRegister);
router.post(
  "/register",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required.").escape(),
    body("lastName").trim().notEmpty().withMessage("Last name is required.").escape(),
    body("email").trim().isEmail().withMessage("Use a valid email address.").normalizeEmail(),
    passwordRules
  ],
  register
);

router.get("/login", renderLogin);
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Use a valid email address.").normalizeEmail(),
    passwordRules
  ],
  login
);

router.post("/logout", logout);

export default router;
