import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

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

export default router;
