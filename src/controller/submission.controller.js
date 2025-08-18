import { db } from "../Libs/db.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const submission = await db.Submission.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(submission);
    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submission,
    });
  } catch (error) {
    console.log(`Submission error is :`.error);
    res.status(500).json({
      error: "Failed to fetch submissions.",
    });
  }
};

export const getSubmissionsForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    console.log(userId, "-----------", problemId);

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
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
    const problemId = req.params.problemId;
    const submission = await db.Submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "submission fetched successfully",
      count: submission,
    });
  } catch (error) {
    console.log(`Submission error is :`.error);
    res.status(500).json({
      error: "Failed to fetch submissions.",
    });
  }
};
