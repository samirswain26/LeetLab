import Razorpay from "razorpay";

export const PaymentInstance = new Razorpay({
  key_id: process.env.Payment_Key_id,
  key_secret: process.env.Payment_key_Secret,
});