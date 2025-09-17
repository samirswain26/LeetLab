import { PaymentInstance } from "../Libs/paymentGateway.js";

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
    const { amount, currency = "INR", subscriptionPlaylistId } = req.body;
    const { userId } = req.user.id;

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await PaymentInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      Currency: order.currency,
      subscriptionPlaylistId,
      key: PaymentInstance.key,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};
