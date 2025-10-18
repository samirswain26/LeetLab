import React, { useMemo } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { CloudLightning } from 'lucide-react';

const Score = () => {
  const { solvedProblems } = useProblemStore();

  const totalScore = useMemo(() => {
    const easycount = solvedProblems.filter(
      (p) => p.difficulty === "EASY"
    ).length;
    const mediumCount = solvedProblems.filter(
      (p) => p.difficulty === "MEDIUM"
    ).length;
    const hardCount = solvedProblems.filter(
      (p) => p.difficulty === "HARD"
    ).length;

    const score = easycount * 1 + mediumCount * 2 + hardCount * 3;
    return score;
  }, [solvedProblems]);

  return (

    <div className="flex flex-col items-center justify-center text-center md:items-end md:text-right">
      <span className="text-sm text-pink-400 font-medium mb-2 mr-4">Score</span>
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-5 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-neutral text-neutral-content shadow-lg">
          <span className="text-2xl font-bold ">

            {solvedProblems.length > 0 ? totalScore : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Score;
