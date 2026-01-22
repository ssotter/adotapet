import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createVisitRequestSchema, updateVisitRequestSchema } from "../validators/visit-requests.validators.js";
import {
  createVisitRequest,
  listMyVisitRequests,
  listReceivedVisitRequests,
  updateVisitRequestStatus,
} from "../controllers/visit-requests.controller.js";

const router = Router();

// interessado solicita visita em um post
router.post(
  "/posts/:postId/visit-requests",
  authMiddleware,
  validate(createVisitRequestSchema),
  createVisitRequest
);

// interessado vê suas solicitações
router.get(
  "/my/visit-requests",
  authMiddleware,
  listMyVisitRequests
);

// dono vê solicitações recebidas
router.get(
  "/my/received-visit-requests",
  authMiddleware,
  listReceivedVisitRequests
);

// dono aprova/rejeita
router.patch(
  "/visit-requests/:id",
  authMiddleware,
  validate(updateVisitRequestSchema),
  updateVisitRequestStatus
);

export default router;
