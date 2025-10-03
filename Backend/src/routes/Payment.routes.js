import express from "express";
import {
  createOrder,
  TrialPayment,
  verifyPayment,
} from "../controller/Paymnet.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const Payment = express.Router();

Payment.post("/payment-1", TrialPayment);
Payment.post("/create-order", authMiddleware, createOrder);
Payment.post("/Verify-Order", authMiddleware, verifyPayment);

export default Payment;
