import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const LanguageMap = {
    RUBY: 72,
    RUST: 73,
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    "C++": 54,
    C: 50,
  };

  return LanguageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SubmitURL = `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`;

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(SubmitURL, { submissions });

  console.log("Submission Result Tokens are : ", data);

  return data; // {token} {tokens} it contains the token given by the judge0 for each test case and for each language.
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );

    const results = data.submissions;

    // every keyword is used to determine that if all the test cases are true then it will be true otherwise false.
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};

export function getLanguageName(LanguageId) {
  const LANGUAGE_NAME = {
    72: "RUBY",
    73: "RUST",
    63: "JAVASCRIPT",
    71: "PYTHON",
    62: "JAVA",
    54: "C++",
    50: "C",
  };
  return LANGUAGE_NAME[LanguageId] || "Unkonwn";
}
