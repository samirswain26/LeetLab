import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleGeminiChat = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const SYSTEM_INSTRUCTION = `
    You are a helpful AI coding tutor.
    You specialize in DSA, algorithms, data structures, and programming problems.
    If the user asks something unrelated to coding (like food, travel, or entertainment),
    politely respond with:
    "I'm a coding-focused assistant. Please ask a DSA or programming-related question."
    `;

    const result = await model.generateContent(`${SYSTEM_INSTRUCTION} \nUser:${prompt}`);
    const aiResponse = result.response.text();

    return res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
