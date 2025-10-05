import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const handleBuy = async (playlist) => {
  try {
    // Create the order first
    const res = await axiosInstance.post("/payment/create-order", {
      playlistId: playlist.id,
      amount: 499,
    });

    console.log("Response for order creation:", res.data);

    const { order } = res.data;

    if (!order || !order.id) {
      toast.error("Order creation failed");
      return;
    }

    toast.success("Order created successfully");

    // DEBUG: Log what's being passed to Razorpay
    console.log("🔑 Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
    console.log("💰 Order details:", order);

    // Razorpay checkout options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Make sure env variable name is correct
      amount: order.amount,
      currency: order.currency,
      name: playlist.name,
      description: `Purchase Playlist: ${playlist.name}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          // Verify payment
          const verifyRes = await axiosInstance.post(
            "/payment/Verify-Order",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              playlistId: playlist.id,
            }
          );

          console.log("✅ Verification response:", verifyRes.data);

          if (verifyRes.data.success) {
            toast.success("Payment successful! Playlist unlocked.");
            // Optional: Refresh the page or update the UI
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          console.error("❌ Error response:", error.response?.data);
          console.error("❌ Error status:", error.response?.status);
          toast.error("Payment verification failed!");
        }
      },
      prefill: {
        name: "", // You can add user name here
        email: "", // You can add user email here
      },
      theme: {
        color: "#0E7490",
      },
    };

    // Initialize Razorpay
    const razorpay = new window.Razorpay(options);
    razorpay.open();

    // Handle payment modal close
    razorpay.on("payment.failed", function (response) {
      console.error("❌ Payment failed:", response.error);
      toast.error("Payment failed: " + response.error.description);
    });
  } catch (error) {
    console.error("Error in handleBuy:", error);
    toast.error("Payment initialization failed!");
  }
};
