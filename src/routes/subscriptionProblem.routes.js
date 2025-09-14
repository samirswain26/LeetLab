import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controller/subscriptionProblem.controller.js";

const SubscriptionProblemRoutes = express.Router();

SubscriptionProblemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);

SubscriptionProblemRoutes.get(
  "/get-all-problems",
  authMiddleware,
  getAllProblems
);
SubscriptionProblemRoutes.get(
  "/get-problem/:id",
  authMiddleware,
  getProblemById
);
SubscriptionProblemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);
SubscriptionProblemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);
SubscriptionProblemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemSolvedByUser
);

export default SubscriptionProblemRoutes;
