import { PaymentInstance } from "../Libs/paymentGateway.js";
import crypto from "crypto";
import { db } from "../Libs/db.js";

export const createOrder = async (req, res) => {
  try {
    const { playlistId, amount } = req.body;

    console.log("Payment key_id : ", PaymentInstance.key_id);
    console.log("Payment key_id : ", PaymentInstance.key_secret);

    console.log("=== CREATE ORDER DEBUG ===");
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    // Validate input
    if (!playlistId || !amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        error: "Playlist ID and valid amount are required",
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User not logged in",
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

    // Check if user already purchased this playlist
    const existingPurchase = await db.SubscriptionPurchase.findUnique({
      where: {
        userId_playlistId: {
          userId: req.user.id,
          playlistId: playlistId,
        },
      },
    });

    if (existingPurchase && existingPurchase.status === "SUCCESS") {
      return res.status(400).json({
        success: false,
        error: "You have already purchased this playlist",
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

    // Save in DB as pending (or update if exists)
    if (existingPurchase) {
      await db.SubscriptionPurchase.update({
        where: { id: existingPurchase.id },
        data: {
          razorpayOrderId: order.id,
          amount: options.amount,
          status: "PENDING",
        },
      });
    } else {
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
    }

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      error: "Order creation failed",
      details: error.message,
    });
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

    // Validate inputs
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !playlistId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: User not logged in",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Update purchase status in database
    const updatedPurchase = await db.SubscriptionPurchase.updateMany({
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

    if (updatedPurchase.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated",
    });
  } catch (error) {
    console.error("Error in verify the payment : ", error);
    res.status(500).json({
      success: fasle,
      error: " Verification failed",
    });
  }
};

export const getPurchaseUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: fasle,
        message: "Unauthorized",
      });
    }

    const purchase = await db.SubscriptionPurchase.findMany({
      where: {
        userId: req.user.id,
        // status: "SUCCESS",
      },
      select: {
        playlistId: true,
      },
    });

    console.log("Purchase is : ", purchase)

    const PurchasePlaylist = purchase.map((p) => p.playlistId);
    console.log("PlaylistId in purchase list is : ", PurchasePlaylist);

    res.status(200).json({
      success: true,
      PurchasePlaylists: PurchasePlaylist,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch purchases",
    });
  }
};
