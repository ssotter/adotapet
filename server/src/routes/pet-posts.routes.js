import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPetPostSchema, updatePetPostSchema } from "../validators/pet-posts.validators.js";
import { getPostContact } from "../controllers/pet-posts.controller.js";
import multer from "multer";
import { uploadPostPhotos } from "../controllers/pet-posts.controller.js";

import {
  createPost,
  listPosts,
  getPostById,
  listMyPosts,
  updatePost,
  setPostStatus,
} from "../controllers/pet-posts.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// público
router.get("/", listPosts);

// logado (precisa vir antes de "/:id")
router.get("/me/mine", authMiddleware, listMyPosts);
router.post("/", authMiddleware, validate(createPetPostSchema), createPost);
router.put("/:id", authMiddleware, validate(updatePetPostSchema), updatePost);
router.patch("/:id/status", authMiddleware, setPostStatus);
router.get("/:id/contact", authMiddleware, getPostContact);
router.post("/:id/photos", authMiddleware, upload.array("photos", 6),uploadPostPhotos);

// público
router.get("/:id", getPostById);

export default router;
