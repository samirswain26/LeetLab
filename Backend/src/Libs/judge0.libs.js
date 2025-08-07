export const getJudge0LanguageId = (language) => {
  const LanguageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return LanguageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );

  console.log("Submission Result : ", data);

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
