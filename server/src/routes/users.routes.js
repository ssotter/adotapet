import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { me, uploadMyAvatar } from "../controllers/users.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = Router();

router.get("/me", authMiddleware, asyncHandler(me));

router.post(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  asyncHandler(uploadMyAvatar)
);

export default router;
