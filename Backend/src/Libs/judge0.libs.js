export const getJudge0LanguageId = (language) => {
  const LanguageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return LanguageMap[language.toUpperCase()]
};
