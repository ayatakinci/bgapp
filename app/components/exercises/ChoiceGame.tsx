"use client";

import { useMemo, useState } from "react";

type Props = {
  bg: string;
  en: string;
  distractors: string[];
  onAnswer: (correct: boolean) => void;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function ChoiceGame({ bg, en, distractors, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = useMemo(() => {
    const wrongOptions = shuffle(distractors.filter((d) => d !== en)).slice(0, 3);
    return shuffle([en, ...wrongOptions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bg, en]);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === en), 900);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <p className="text-3xl font-semibold tracking-tight">{bg}</p>
      <div className="grid w-full grid-cols-1 gap-2">
        {options.map((option) => {
          const isCorrect = option === en;
          const isSelected = option === selected;

          let style = "border-stone-300 text-stone-700 hover:bg-stone-100";
          if (selected) {
            if (isCorrect) {
              style = "border-emerald-600 bg-emerald-50 text-emerald-700";
            } else if (isSelected) {
              style = "border-rose-600 bg-rose-50 text-rose-700";
            } else {
              style = "border-stone-200 text-stone-400";
            }
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
