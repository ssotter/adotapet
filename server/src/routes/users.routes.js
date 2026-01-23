import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { me, uploadMyAvatar } from "../controllers/users.controller.js";

const router = Router();

router.get("/me", authMiddleware, me);

router.post(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadMyAvatar
);

export default router;