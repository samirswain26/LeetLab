import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { getAllSubmissions, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controller/subscriptionSubmission.controller.js"

const SubscriptionSubmissionRoute = express.Router()

SubscriptionSubmissionRoute.get("/get-all-submissions", authMiddleware, getAllSubmissions)
SubscriptionSubmissionRoute.get("/get-submissions/:problemId", authMiddleware, getSubmissionsForProblem)
SubscriptionSubmissionRoute.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem)

export default SubscriptionSubmissionRoute