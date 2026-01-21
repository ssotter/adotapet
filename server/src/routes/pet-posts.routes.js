import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPetPostSchema, updatePetPostSchema } from "../validators/pet-posts.validators.js";

import {
  createPost,
  listPosts,
  getPostById,
  listMyPosts,
  updatePost,
  setPostStatus,
} from "../controllers/pet-posts.controller.js";

const router = Router();

// público
router.get("/", listPosts);

// logado (precisa vir antes de "/:id")
router.get("/me/mine", authMiddleware, listMyPosts);
router.post("/", authMiddleware, validate(createPetPostSchema), createPost);
router.put("/:id", authMiddleware, validate(updatePetPostSchema), updatePost);
router.patch("/:id/status", authMiddleware, setPostStatus);

// público
router.get("/:id", getPostById);

export default router;
