import { db } from "../Libs/db.js";

export const getAllSubmissions = async(req, res) => {
    try {
        const userId = req.user.id
        const submission = await db.SubscriptionSubmission.findMany({
            where:{
                userId: userId
            }
        })

        if(!submission){
            return res.status(404).json({
                error: "Submissions not found"
            })
        }
        res.status(201).json({
            success: true,
            message: "Submission fetched successfully",
            submission
        })
    } catch (error) {
        console.log("submission error is : ", error)
        res.status(500).json({
            error: "Failed to fetch submission"
        })
    }
}

export const getSubmissionsForProblem = async(req, res) => {}

export const getAllTheSubmissionsForProblem = async(req, res) => {}