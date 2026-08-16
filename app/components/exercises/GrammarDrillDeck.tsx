"use client";

import { useState } from "react";
import { GrammarDrill } from "./GrammarDrill";

type Drill = {
  id: number;
  promptBg: string;
  promptEn: string;
  correctAnswer: string;
  options: string[];
};

type Props = {
  drills: Drill[];
};

export function GrammarDrillDeck({ drills }: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  if (drills.length === 0) {
    return <p className="text-stone-500">No drills for this topic yet.</p>;
  }

  if (index >= drills.length) {
    return (
      <p className="text-lg font-medium text-stone-700">
        Done! {correctCount} / {drills.length} correct. 🎉
      </p>
    );
  }

  const current = drills[index];

  function handleAnswer(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-stone-400">
        {index + 1} / {drills.length}
      </p>
      <GrammarDrill
        key={current.id}
        promptBg={current.promptBg}
        promptEn={current.promptEn}
        correctAnswer={current.correctAnswer}
        options={current.options}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
