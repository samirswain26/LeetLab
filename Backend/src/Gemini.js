import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // ✅ correct syntax
  const prompt = "Explain how AI works in a few words.";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

main();
