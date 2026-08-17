"use client";

import { useMemo, useState } from "react";
import { SpeakButton } from "@/app/components/SpeakButton";

type Props = {
  bg: string;
  en: string;
  distractors: string[];
  onAnswer: (correct: boolean) => void;
};

// A Client Component's first render happens on the SERVER (to produce
// fast initial HTML), then again in the browser during hydration -- both
// runs must produce identical output, or React throws a hydration
// mismatch. Math.random() breaks that: it gives a different order each
// time it's called, so the server's shuffle and the client's shuffle
// disagreed. This hashes the word itself as a seed instead, so the
// "shuffle" is really a deterministic sort -- same word, same order,
// every time, on both server and client.
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

export function ChoiceGame({ bg, en, distractors, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const options = useMemo(() => {
    const wrongOptions = seededShuffle(
      distractors.filter((d) => d !== en),
      bg
    ).slice(0, 3);
    return seededShuffle([en, ...wrongOptions], bg + "x");
  }, [bg, en, distractors]);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === en), 900);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <div className="flex items-center gap-2">
        <p className="text-3xl font-semibold tracking-tight">{bg}</p>
        <SpeakButton text={bg} />
      </div>
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
