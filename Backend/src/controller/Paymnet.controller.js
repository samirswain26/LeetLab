import { PaymentInstance } from "../Libs/paymentGateway.js";
import crypto from "crypto";
import { db } from "../Libs/db.js";

export const TrialPayment = async (req, res) => {
  try {
    // const amount = req.body.amount*100
    const amount = req.body.amount * 100;
    console.log("amount is : ", amount);
    console.log("amount is : ", amount);
    const options = {
      //   amount : Number(req.body.amount*100)  , // Razorpay expects amount in paise (so 100 INR = 10000)
      amount: Number(amount), // Razorpay expects amount in paise (so 100 INR = 10000)
      currency: "INR",
    };

    console.log("Payment key_id : ", PaymentInstance.key_id);
    const Order = await PaymentInstance.orders.create(options);

    res.status(200).json({
      message: "Hello",
      success: true,
      Order,
    });
  } catch (error) {
    console.log("Error in payment is : ", error);
    res.status(400).json({
      error: `Code fat gaya`,
      error,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { playlistId, amount } = req.body;

    // Validate input
    if (!playlistId || !amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: "Playlist ID and valid amount are required",
      });
    }

    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    // Amount in paise (INR smallest unit)
    const finalAmount = Number(amount) * 100;

    const options = {
      amount: finalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await PaymentInstance.orders.create(options);

    console.log("Razorpay order created:", order);

    if (!order || !order.id) {
      return res.status(500).json({
        success: false,
        error: "Failed to create Razorpay order",
      });
    }

    // ⚠️ Make sure req.user exists (authentication middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User not logged in",
      });
    }

    // Save in DB as pending
    await db.SubscriptionPurchase.create({
      data: {
        userId: req.user.id,
        playlistId,
        razorpayOrderId: order.id,
        amount: options.amount,
        currency: options.currency,
        status: "PENDING",
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist added to purchase table with a valid amount",
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      playlistId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHash("sha256", process.env.Payment_key_Secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    await db.SubscriptionPurchase.updateMany({
      where: {
        razorpayOrderId: razorpay_order_id,
        playlistId,
        userId: req.user.id,
      },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated",
    });
  } catch (error) {
    console.error("Error in verify the payment : ", error)
    res.status(500).json({
      success: fasle,
      error:" Verification failed" 
    })
  }
};
