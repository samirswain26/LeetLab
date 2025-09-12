import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemtableOnProblemPage from "../components/ProblemTableOnProfilepage";

const ProblemsPage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animated-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-4">
      <div className="absolute top-16 left-0 h-1/3 w-1/3 bg-primary opacity-30 blur-3xl rounded-md button-9"></div>
      <h1 className="text-4xl font-extrabold z-10 text-center">
        Solve The <span className="text-primary">Problems</span>
      </h1>
      {problems.length > 0 ? (
        <ProblemtableOnProblemPage problems={problems} />
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
      )}
      
    </div>
  );
};

export default ProblemsPage;
