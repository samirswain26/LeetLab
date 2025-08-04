import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.routes.js";

dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello Guys Welcome to leetlab🔥");
});

// Route Endpoints
app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port : ${port}`);
});
