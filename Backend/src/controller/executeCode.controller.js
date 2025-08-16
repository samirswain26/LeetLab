import { pollBatchResults, submitBatch } from "../Libs/judge0.libs.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    // Validate test cases are in the proper array format or not

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases" });
    }

    // Prepare each test cases for batch submissions
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send batch of submissions to judge0
    const submissionResponse = await submitBatch(submissions);

    const tokens = submissionResponse.map((res) => res.token);

    // Pull judge0 for all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Results---------------");
    console.log(results);

    res.status(200).json({
      message: "Code Executed",
    });
  } catch (error) {
    console.log("Execute Code", error);
    res.status(500).json({
      error: "Failed to execute the code.",
    });
  }
};
