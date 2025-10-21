import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Snowflake,
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore.js";
import { useExecutionStore } from "../store/useExecutionStore.js";
import { getLanguageId } from "../libs/lang.js";
import SubmissionResults from "../components/Submission.jsx";
import SubmissionsList from "../components/SubmissionsList.jsx";
import { useSubmissionStore } from "../store/useSubmissionStore.js";
import toast from "react-hot-toast";
import { usebookMarkStore } from "../store/bookmark.js";

const ProblemPage = () => {
  const { id } = useParams();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    addbooMark,
    removeBookmark,
    getallBookmarks,
    currentbookMark,
    isLoading: isBookmarkLoading,
  } = usebookMarkStore();

  const {
    submission: submissions,
    isLoading,
    getAllSubmissions,
    getSubmissionForPeoblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedlanguage] = useState("JAVASCRIPT"); //By putting the value in uppercase it directly shows the code in that language
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [bookmarkId, setBookmarkId] = useState(null);
  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    const loadBookmarks = async () => {
      const all = await getallBookmarks();
      const found1 = await currentbookMark?.find((a) => a.problemId === id);

      if (found1) {
        setIsBookmarked(true);
        setBookmarkId(found1?.problemId);
      } else {
        setBookmarkId(false);
        setBookmarkId(false);
      }
    };
    loadBookmarks();
  }, [id]);

  console.log("Get bookmarks in main page : ", currentbookMark);
  console.log("Get bookmarks in main pag111e : ", getallBookmarks);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked && bookmarkId) {
        await removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(false);
      } else {
        const newBM = await addbooMark(id);
        if (newBM) {
          setIsBookmarked(true);
          setBookmarkId(newBM?.id);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  console.log("id is :", id);

  // const submissionCount = 10;
  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");

      setTestCases(
        problem.testcases.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForPeoblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedlanguage(language);
    setCode(problem.codeSnippets?.[language] || "");
  };

  // This line was responsible to load the problem when user clicked the particular problem, although i had handled in the return statemant..
  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            // isLoading={isSubmissionsLoading}
            isLoading={isLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        // return (
        //   <div className="p-4 text-center text-base-content/70"> No Hints </div>
        // );
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleShare = () => {
    const Url = window.location.href;
    try {
      navigator.clipboard.writeText(Url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL: ", error);
      toast.error("Failed to copy theLink");
    }
  };

  console.log("Submission is : ", submissions);
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full">
      {isProblemLoading ? (
        <p className="text-center p-6">Loading Problem...</p>
      ) : !problem ? (
        <p className="text-center p-6">Problem Not Found...</p>
      ) : (
        <>
          <nav className="navbar bg-base-100 shadow-lg px-4">
            <div className="flex-1 gap-2">
              <Link to={"/"} className="flex items-center gap-2 text-primary">
                <Home className="w-6 h-6" />
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="mt-2">
                <h1 className="text-xl font-bold">{problem?.title}</h1>
                <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {new Date(problem?.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-base-content/30">•</span>
                  <Users className="w-4 h-4" />
                  <span> {submissionCount} Submissions</span>
                </div>
              </div>
            </div>
            <div className="flex-none gap-4">
              <button
                className={`btn btn-ghost btn-circle ${
                  isBookmarked ? "text-primary" : ""
                }`}
                onClick={handleBookmarkToggle}
                disabled={isBookmarkLoading}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                className="btn btn-ghost btn-circle"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </button>
              <select
                className="select select-bordered select-primary w-40"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {Object.keys(problem.codeSnippets || {}).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </nav>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                  <div className="tabs tabs-bordered">
                    <button
                      className={`tab gap-2 ${
                        activeTab === "description" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      <FileText className="w-4 h-4" />
                      Description
                    </button>
                    <button
                      className={`tab gap-2 ${
                        activeTab === "submissions" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("submissions")}
                    >
                      <Code2 className="w-4 h-4" />
                      Submissions
                    </button>
                    <button
                      className={`tab gap-2 ${
                        activeTab === "discussion" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("discussion")}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussion
                    </button>
                    <button
                      className={`tab gap-2 ${
                        activeTab === "hints" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("hints")}
                    >
                      <Lightbulb className="w-4 h-4" />
                      Hints
                    </button>
                  </div>

                  <div className="p-6">{renderTabContent()}</div>
                </div>
              </div>

              {/* Editor Div */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0 ">
                  <div className="tabs tabs-bordered">
                    <button className="tab tab-active gap-2">
                      <Terminal className="w-4 h-4" />
                      Code Editor
                    </button>
                  </div>

                  <div className="h-[600px] w-full">
                    <Editor
                      height="100%"
                      language={selectedLanguage.toLowerCase()}
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 22,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                        // wordWrap: "on",
                        formatOnType: true,
                      }}
                    />
                  </div>

                  <div className="p-4 border-base-300 bg-base-200 ">
                    <div className="flex justify-between items-center">
                      <button
                        className={`btn btn-primary gap-2 ${
                          isExecuting ? "loading" : ""
                        }`}
                        onClick={handleRunCode}
                        disabled={isExecuting}
                      >
                        {!isExecuting && <Play className="w-4 h-4" />}
                        Run Code
                      </button>
                      <button className="btn btn-success gap-2">
                        Submit Solution
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                {submission ? (
                  <SubmissionResults submission={submission} />
                ) : (
                  <>
                    {console.log("submission is empty:", submissions)}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Test Cases</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Input</th>
                            <th>Expected Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testcases.map((testCase, index) => (
                            <tr key={index}>
                              <td className="font-mono">{testCase.input}</td>
                              <td className="font-mono">{testCase.output}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemPage;
