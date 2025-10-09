import { db } from "../Libs/db.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submission = await db.SubscriptionSubmission.findMany({
      where: {
        userId,
      },
    });

    if (!submission) {
      return res.status(404).json({
        error: "Submissions not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "Submission fetched successfully",
      submission,
    });
  } catch (error) {
    console.log("submission error is : ", error);
    res.status(500).json({
      error: "Failed to fetch submission",
    });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  const problemId = req.params.problemId;
  const userId = req.user.id;
  try {
    const submissions = await db.SubscriptionSubmission.findMany({
      where: {
        userId,
        problemId,
      },
    });

    console.log("Get submissions for problem :", submissions);

    res.status(200).json({
      success: true,
      message: "submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.log(`Submission error is :`.error);
    res.status(500).json({
      error: "Failed to fetch submissions.",
    });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    const submissions = await db.SubscriptionSubmission.count({
      where: {
        userId,
        problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "submission fetched successfully",
      count: submissions,
    });
  } catch (error) {
    console.log(`Submission error is :`.error);
    res.status(500).json({
      error: "Failed to fetch submissions.",
    });
  }
};
