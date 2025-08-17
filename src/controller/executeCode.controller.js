import { db } from "../Libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../Libs/judge0.libs.js";

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

    // check and analyze test case results

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }
      // console.log(`Testcases ${i + 1}`);
      // console.log(`Input ${stdin[i]}`);
      // console.log(`Expected output from testcases ${expected_output}`);
      // console.log(`Actual output ${stdout}`);

      // console.log(`Matched ${passed}`);
      // console.log("-------------");
      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderror: result.stderror || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} Sec` : undefined,
      };
    });
    console.log(detailedResults);

    // Store Submissions
    const submission = await db.Submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compileOutput)
          ? JSON.stringify(detailedResults.map((r) => r.compileOutput))
          : null,
        // status: JSON.stringify(detailedResults.map((r) => r.status))
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
        // user: {
        //   connect: { id: userId },
        // },
        // problem: {
        //   connect: { id: problemId },
        // },
      },
    });

    // If all passes = true mark problem as solved for the current user
    if (allPassed) {
      await db.problemSolved.upsert({
        // upsert :- if record doesnot exist then create it otherwise update it.(update + insert)
        where: {
          userId_problemId: {
            // Here userId and problemId is the unique identifier taht was already in the problemSolved model
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // Save indevidual test case results

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderror: result.stderror,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.TestCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.Submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testcase: true, // In the response it shows the testcase as the array with inside object of testcases...
      },
    });

    res.status(200).json({
      succss: true,
      message: "Code Executed successfully",
      submissionWithTestCase,
    });
  } catch (error) {
    console.log("Execute Code", error);
    res.status(500).json({
      error: "Failed to execute the code.",
    });
  }
};
