import express from "express";
import {
  createOrder,
  getPurchaseUser,
  verifyPayment,
} from "../controller/Paymnet.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const Payment = express.Router();

Payment.post("/create-order", authMiddleware, createOrder);
Payment.post("/Verify-Order", authMiddleware, verifyPayment);
Payment.get("/user-purchases", authMiddleware, getPurchaseUser)

export default Payment;
