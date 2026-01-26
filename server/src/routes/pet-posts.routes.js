import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createPetPostSchema,
  updatePetPostSchema,
} from "../validators/pet-posts.validators.js";

import {
  createPost,
  listPosts,
  getPostById,
  listMyPosts,
  updatePost,
  setPostStatus,
  uploadPostPhotos,
  setPostCover,
  deletePostPhoto,
  getPostContact,
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

router.post(
  "/:id/photos",
  authMiddleware,
  upload.array("photos", 6),
  uploadPostPhotos
);

router.patch("/:id/cover", authMiddleware, setPostCover);
router.delete("/:id/photos/:photoId", authMiddleware, deletePostPhoto);

router.get("/:id/contact", authMiddleware, getPostContact);

// público
router.get("/:id", getPostById);

export default router;
