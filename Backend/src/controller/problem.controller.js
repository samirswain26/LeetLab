import { db } from "../Libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../Libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  const {
    title,
    decsription,
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

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutioncode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

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

      // Save the proble to the database

      const newProblem = await db.problem.create({
        data: {
          title,
          decsription,
          difficulty,
          tags,
          constraints,
          examples,
          testcases,
          codeSnippets,
          referenceSolutions,
          user: user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem Created Successfully",
        problem: newProblem,
      });
    }
  } catch (error) {}
};

export const getAllProblems = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getAllProblemSolvedByUser = async (req, res) => {};
