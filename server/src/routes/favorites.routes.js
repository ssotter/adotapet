import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  listFavorites,
  listFavoriteIds,
  favoritePost,
  unfavoritePost,
} from "../controllers/favorites.controller.js";

const router = Router();

router.get("/favorites", authMiddleware, listFavorites);
router.get("/favorites/ids", authMiddleware, listFavoriteIds);
router.post("/favorites/:postId", authMiddleware, favoritePost);
router.delete("/favorites/:postId", authMiddleware, unfavoritePost);

export default router;
