import express from "express";
import { createOrder, TrialPayment } from "../controller/Paymnet.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const Payment = express.Router();

Payment.post("/payment-1", TrialPayment);
Payment.post("/create-order",authMiddleware, createOrder);

export default Payment;
