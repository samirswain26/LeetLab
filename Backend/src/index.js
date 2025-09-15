import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

// Routes
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import SubscriptionProblemRoutes from "./routes/subscriptionProblem.routes.js";
import SubscriptionSubmissionRoute from "./routes/subscriptionSubmission.routes.js";

dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials : true
}))

app.get("/", (req, res) => {
  res.send("Hello Guys Welcome to leetlab🔥");
});

// Route Endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/Play-List", playlistRoutes);
// Subscription Endpoints
app.use("/api/v1/subscription-problems", SubscriptionProblemRoutes);
app.use("/api/v1/subscription-submission", SubscriptionSubmissionRoute);


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port : ${port}`);
});
