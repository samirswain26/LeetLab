import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controller/subscriptionExecutionCode.controller.js";

const SubscriptionexecutionRoute = express.Router();

SubscriptionexecutionRoute.post("/", authMiddleware, executeCode);

export default SubscriptionexecutionRoute;
