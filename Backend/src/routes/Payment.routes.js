import express from "express"
import { TrialPayment } from "../controller/Paymnet.controller.js"

const Payment = express.Router()

Payment.post("/payment-1", TrialPayment)

export default Payment