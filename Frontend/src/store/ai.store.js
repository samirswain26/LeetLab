import { axiosInstance } from "../libs/axios";

export const ai = async (prompt) => {
  try {
    const res = await axiosInstance.post("/gemini/chat", {
      prompt,
    });

    console.log("Ai resposne is :", res.data);
    const message =
      res.data?.message ||
      res.data?.response ||
      res.data?.result ||
      res.data?.content ||
      "No response received";

    return {
        success: res.data?.success !== false,
    //   success: true,
      message,
    };
  } catch (error) {
    console.log("Error in Ai assistance : ", error);
    return {
      success: false,
      message:
        error.res?.data?.message ||
        error.message ||
        "Failed to get response from AI. Please try again.",
    //   error: error,
    };
  }
};
