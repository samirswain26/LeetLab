import express from "express"
import { handleGeminiChat } from "../controller/GeminiApi.js"

const geminiRoutes = express.Router()

geminiRoutes.post("/chat",handleGeminiChat )

export default geminiRoutes