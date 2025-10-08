function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TypeScript: 74,
  };
  return languageMap[language.toUpperCase()];
}

function getSubscriptionLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
    72: "RUBY",
    73: "RUST",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getSubscriptionLanguageName };

export function getSubscriptionLanguageId(language) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TypeScript: 74,
    RUBY: 72,
    RUST: 73,
  };
  return languageMap[language.toUpperCase()];
}
