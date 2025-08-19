import { db } from "../Libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../Libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    // hints,
    // editorial,
    constraints,
    examples,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem.",
    });
  }
  console.log("Reached create problem", title);
  try {
    for (const [language, solutioncode] of Object.entries(referenceSolutions)) {
      const languageId = await getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }
      console.log(languageId);

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutioncode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      console.log(`Submissions are : ${submissions}`);

      const submissionResults = await submitBatch(submissions);
      console.log("SubmissionResult is: ", submissionResults);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Results----", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
    // Save the problem to the database

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        // hints,
        // editorial,
        constraints,
        examples,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log("Error Creating the problem  ", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      return res.status(404).json({
        error: "No problems found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log("Get all project Error is : ", error);
    return res.status(500).json({
      error: "Error while fetching problems.",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Id is ${id}`);
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "problem Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.log("Get project by id Error is  : ", error);
    return res.status(500).json({
      error: "Error while fetching problem.",
    });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem.",
    });
  }

  try {
    for (const [language, solutioncode] of Object.entries(referenceSolutions)) {
      const languageId = await getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }
      console.log(languageId);

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutioncode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      console.log(`Submissions are : ${submissions}`);

      const submissionResults = await submitBatch(submissions);
      console.log("SubmissionResult is: ", submissionResults);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Results----", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // Save the problem to the database

    const newProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        constraints,
        examples,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Problem updated Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log("Error Updating the problem  ", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problm not found",
      });
    }

    await db.problem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully!",
    });
  } catch (error) {
    console.log("Delete Problem", error);
    res.status(500).json({
      error: "Failed to delete the problem.",
    });
  }
};
//
export const getAllProblemSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problems,
    });
  } catch (error) {
    console.log("Get All problems error : ", error);
    res.status(500).json({
      error: "Failed to get all problems",
    });
  }
};
