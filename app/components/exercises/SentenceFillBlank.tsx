"use client";

import { useMemo, useState } from "react";

type Props = {
  bg: string;
  en: string;
  matchedWord: string;
  distractors: string[];
  onAnswer: (correct: boolean) => void;
};

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

// bg is stored with its real casing (sentence-initial capitals etc), but
// matchedWord was derived from a lowercased tokenization -- find the
// match case-insensitively, then split the *original* string around it
// so surrounding punctuation/casing stays intact.
function splitOnMatch(bg: string, matchedWord: string): [string, string] {
  const idx = bg.toLowerCase().indexOf(matchedWord.toLowerCase());
  if (idx === -1) return [bg, ""];
  return [bg.slice(0, idx), bg.slice(idx + matchedWord.length)];
}

export function SentenceFillBlank({ bg, en, matchedWord, distractors, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const [before, after] = useMemo(() => splitOnMatch(bg, matchedWord), [bg, matchedWord]);

  const options = useMemo(() => {
    const wrongOptions = seededShuffle(
      distractors.filter((d) => d !== matchedWord),
      bg
    ).slice(0, 3);
    return seededShuffle([matchedWord, ...wrongOptions], bg + "x");
  }, [bg, matchedWord, distractors]);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === matchedWord), 900);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <div>
        <p className="text-xl font-semibold tracking-tight">
          {before}
          <span
            className={`mx-1 inline-block min-w-[3ch] border-b-2 ${
              selected
                ? selected === matchedWord
                  ? "border-emerald-600 text-emerald-700"
                  : "border-rose-600 text-rose-700"
                : "border-stone-400 text-stone-400"
            }`}
          >
            {selected ?? "___"}
          </span>
          {after}
        </p>
        <p className="mt-2 text-sm text-stone-500">{en}</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {options.map((option) => {
          const isCorrect = option === matchedWord;
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
