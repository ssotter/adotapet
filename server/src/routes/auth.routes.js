import { Router } from "express";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validators.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }
  };
}

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// ✅ 1) Trocar senha (logado)
router.patch(
  "/me/password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);

// ✅ 2) Solicitar reset (envia e-mail com token)
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// ✅ 3) Aplicar reset (token + nova senha)
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
