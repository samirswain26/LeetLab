import express from "express";
import {
  check,
  googleAuth,
  googleCallBack,
  login,
  Logout,
  logout,
  register,
} from "../controller/auth.controller.js";
import { authenticateToken, authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.get("/check", authMiddleware, check);

// OID connect 
authRoutes.get("/google", googleAuth)
authRoutes.get("/google/callback", googleCallBack)
authRoutes.get("/me", authenticateToken, check)
authRoutes.get("/Logout", authenticateToken, Logout)

export default authRoutes;
