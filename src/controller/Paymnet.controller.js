import Razorpay from "razorpay";

export const PaymentInstance = new Razorpay({
  key_id: process.env.Payment_Key_id,
  key_secret: process.env.Payment_key_Secret,
});

export const TrialPayment = async (req, res) => {
  try {
    // const amount = req.body.amount*100
    const amount = req.body.amount*100
    console.log("amount is : ", amount)
    console.log("amount is : ", amount)
    const options = {
    //   amount : Number(req.body.amount*100)  , // Razorpay expects amount in paise (so 100 INR = 10000)
      amount : Number(amount)  , // Razorpay expects amount in paise (so 100 INR = 10000)
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
      error
    });
  }
};
