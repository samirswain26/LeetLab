import db from "../Libs/db.js";
import { getJudge0LanguageId } from "../Libs/judge0.libs.js";

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

  if(req.user.role !== "ADMIN"){
    return res.status(403).json({
        error: "You are not allowed to create a problem."
    })
  }

  try {
    for(const [language, solutioncode] of Object.entries(referenceSolutions)){
        const languageId = await getJudge0LanguageId(language)
        if(!languageId){
            return res.status(400).json({
                error: `Language ${language} is not supported`
            })
        }
    }
  } catch (error) {
    
  }
  
};

export const getAllProblems = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getAllProblemSolvedByUser = async (req, res) => {};
