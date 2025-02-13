const express = require("express");
const router = express.Router();
const {
  login,
  list,
  register,
  profile,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  verifyEmailCode,
  sendCode,
} = require("../controllers/usersController.js");
const verifyToken = require("../middlewares/verifyToken");
const { body } = require("express-validator");

// Validaciones login
const loginValidations = [
  body("email").notEmpty().withMessage("Debes completar el campo"),
  body("password").notEmpty().withMessage("Debes completar el campo"),
];

const registerValidations = [
  body("password").notEmpty().withMessage("Debes completar el campo"),
  body("email").notEmpty().isEmail().withMessage("Email invalido"),
];

router.post("/login", loginValidations, login);
router.post("/register", registerValidations, register);
router.get("/profile/:id", verifyToken, profile);
router.get("/list", verifyToken, list);
router.post("/sendCode", verifyToken, sendCode);

// Email verification routes
router.post("/verify-email-code", verifyEmailCode);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
