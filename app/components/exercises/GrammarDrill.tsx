"use client";

import { useMemo, useState } from "react";

type Props = {
  promptBg: string;
  promptEn: string;
  correctAnswer: string;
  options: string[];
  onAnswer: (correct: boolean) => void;
};

// Same seeded-shuffle approach as ChoiceGame -- Math.random() during
// render would disagree between the server's first pass and the
// browser's hydration pass. Seeding from promptBg (stable per drill)
// keeps both renders identical.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function seededShuffle<T extends string>(items: T[], seed: string): T[] {
  return [...items].sort((a, b) => hashString(seed + a) - hashString(seed + b));
}

export function GrammarDrill({ promptBg, promptEn, correctAnswer, options, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const shuffledOptions = useMemo(() => seededShuffle(options, promptBg), [options, promptBg]);
  const [before, after] = promptBg.split("___");

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === correctAnswer), 900);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <div>
        <p className="text-2xl font-semibold tracking-tight">
          {before}
          <span
            className={`mx-1 inline-block min-w-[3ch] border-b-2 ${
              selected
                ? selected === correctAnswer
                  ? "border-emerald-600 text-emerald-700"
                  : "border-rose-600 text-rose-700"
                : "border-stone-400 text-stone-400"
            }`}
          >
            {selected ?? "___"}
          </span>
          {after}
        </p>
        <p className="mt-2 text-sm text-stone-500">{promptEn}</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {shuffledOptions.map((option) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;

          let style = "border-stone-300 text-stone-700 hover:bg-stone-100";
          if (selected) {
            if (isCorrect) style = "border-emerald-600 bg-emerald-50 text-emerald-700";
            else if (isSelected) style = "border-rose-600 bg-rose-50 text-rose-700";
            else style = "border-stone-200 text-stone-400";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
