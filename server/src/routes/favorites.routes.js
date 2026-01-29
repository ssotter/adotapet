// server/src/routes/favorites.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addFavorite,
  removeFavorite,
  listFavoriteIds,
  listFavorites,
} from "../controllers/favorites.controller.js";

const router = Router();

router.post("/favorites/:postId", authMiddleware, addFavorite);
router.delete("/favorites/:postId", authMiddleware, removeFavorite);

router.get("/favorites/ids", authMiddleware, listFavoriteIds);
router.get("/favorites", authMiddleware, listFavorites);

export default router;
