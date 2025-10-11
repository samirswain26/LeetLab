import { useEffect, useState } from "react";
import { useSubscriptionExecutionStore } from "../store/useExecutionStore";
import { useProblemStore } from "../store/useSubscriptionProblemStore";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscriptionSubmissionStore } from "../store/useSubmissionStore.js";
import { getSubscriptionLanguageId } from "../libs/lang";
import Editor from "@monaco-editor/react";

import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  Home,
  Brain,
  X,
  Send,
  Loader,
} from "lucide-react";
import SubmissionResults from "../components/SubscriptionSubmission.jsx";
import SubmissionsList from "../components/SubscriptionSubmissionList.jsx";

import { ai } from "../store/ai.store.js";

const AiAssistance = ({ isOpen, onClose, problem }) => {
  const [aiMessages, setAiMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    setAiMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      // ✅ AI API Call
      const response = await ai(
        `You are a DSA assistant. Only answer code or algorithm-related questions. ${prompt}`
      );

      const assistantMessage = {
        role: "assistant",
        content: response.message,
        success: response.success,
      };

      setAiMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error getting AI response.",
          success: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-3xl h-[700px] flex flex-col bg-base-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 pb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold text-lg">Your AI Assistant</h3>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {aiMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/70">
              <Brain className="w-20 h-20 mb-4 opacity-20" />
              <p className="text-center font-semibold text-lg">
                Ask me anything about this coding problem!
              </p>
              <p className="text-center text-sm mt-3 max-w-md">
                I can help explain algorithms, debug your code, or suggest
                optimal DSA approaches.
              </p>
            </div>
          ) : (
            aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat ${
                  msg.role === "user" ? "chat-end" : "chat-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="chat-image avatar">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-primary-content mt-2 ml-2" />
                    </div>
                  </div>
                )}
                <div
                  className={`chat-bubble ${
                    msg.role === "user"
                      ? "chat-bubble-primary"
                      : msg.success === false
                      ? "chat-bubble-error"
                      : "chat-bubble-secondary"
                  } max-w-lg lg:max-w-2xl break-words whitespace-pre-wrap`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar ">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse flex-shrink-0">
                  <Brain className="w-6 h-6 text-primary-content flex-shrink-0 mt-2 ml-2"/>
                </div>
              </div>
              <div className="chat-bubble chat-bubble-secondary flex items-center gap-3 px-6 py-4">
                <Loader className="w-5 h-5 animate-spin flex-shrink-0" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>


        {/* Input Area */}
        <div className="border-t border-base-300 p-6 bg-base-100">
          <div className="flex gap-3 items-end">
            <textarea
              placeholder="Ask for help..."
              className="textarea textarea-bordered flex-1 bg-base-200 focus:outline-none focus:border-primary focus:bg-base-100 resize-none overflow-hidden"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                // Auto-expand textarea
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={isLoading}
              maxLength="5000"
              rows="1"
              style={{
                minHeight: "44px",
                maxHeight: "200px",
              }}
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-primary gap-2 h-11 px-4"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-base-content/50 mt-2 text-right">
            {prompt.length}/5000 characters
          </p>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
};

const SubscribedProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading,
    getAllSubmissions,
    getSubmissionForPeoblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubscriptionSubmissionStore();

  console.log("Submission nks submission is :", submissions);

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedlanguage] = useState("JAVASCRIPT"); //By putting the value in uppercase it directly shows the code in that language
  const [testcases, setTestCases] = useState([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const { isExecuting, submission, executeCode } =
    useSubscriptionExecutionStore();

  const handleback = () => {
    navigate(-1);
  };

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
                      className="bg-base-200 p-6 rounded-xl mb-2 font-mono flex justify-baseline space-x-10"
                    >
                      <div className="mb-2 ml-5">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className=" bg-black/90 px-1 py-1 rounded-lg font-semibold text-white">
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
                          <p className="  text-base-content/70 text-lg font-sem">
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
                  <span className="bg-black/90 px-1 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList submissions={submissions} isLoading={isLoading} />
        );
      case "discussion":
        return (
          <div className="p-4">
            {problem?.discussion ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="px-1 py-1 rounded-lg font-semibold text-white text-lg">
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
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="px-1 py-1 rounded-lg font-semibold text-white text-lg">
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
      const language_id = getSubscriptionLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };
  console.log("Submission is : ", submissions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full">
      <AiAssistance
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        problem={problem}
      />
      {isProblemLoading ? (
        <p className="text-center p-6">Loading Problem...</p>
      ) : !problem ? (
        <p className="text-center p-6">Problem Not Found...</p>
      ) : (
        <>
          <nav className="navbar bg-base-100 shadow-lg px-4">
            <div className="flex-1 gap-2">
              <button
                onClick={handleback}
                className="flex items-center gap-2 text-primary"
              >
                <Home className="w-6 h-6" />
                <ChevronRight className="w-4 h-4" />
              </button>
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
              {/* <button
                className={`btn btn-ghost btn-circle ${
                  isBookmarked ? "text-primary" : ""
                }`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className="w-5 h-5" />
              </button> */}
              <button
                className="btn btn-ghost btn-circle h-5 w-15"
                onClick={() => setIsAIModalOpen(true)}
              >
                <span>Ai</span>
                {/* <Share2 className="w-5 h-5" /> */}
                <Brain className="w-5 h-5" />
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
                        formatOnPaste: true,
                        tabSize: 2,
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

export default SubscribedProblemPage;
