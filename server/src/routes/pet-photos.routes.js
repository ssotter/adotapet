import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadPostPhoto, deletePhoto } from "../controllers/pet-photos.controller.js";

const router = Router();

// upload de foto para um anúncio (dono)
router.post(
  "/posts/:id/photos",
  authMiddleware,
  upload.single("photo"),
  uploadPostPhoto
);

// remover foto (dono)
router.delete(
  "/photos/:id",
  authMiddleware,
  deletePhoto
);

export default router;
