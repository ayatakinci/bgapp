"use client";

import { useMemo, useState } from "react";
import { speak, useHasBulgarianVoice } from "@/app/components/SpeakButton";

type Props = {
  bg: string;
  en: string;
  distractors: string[];
  onAnswer: (correct: boolean) => void;
};

// Same seeded-shuffle fix as ChoiceGame -- Math.random() during render
// would disagree between the server's first pass and the browser's
// hydration pass.
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

// Unlike ChoiceGame, the Bulgarian text is never shown before an answer --
// this is the one exercise that actually tests listening comprehension
// rather than reading, since every other exercise type puts the Bulgarian
// word on screen from the start.
export function ListeningExercise({ bg, en, distractors, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const hasBulgarianVoice = useHasBulgarianVoice();

  const options = useMemo(() => {
    const wrongOptions = seededShuffle(
      distractors.filter((d) => d !== en),
      bg
    ).slice(0, 3);
    return seededShuffle([en, ...wrongOptions], bg + "x");
  }, [bg, en, distractors]);

  function handlePlay() {
    speak(bg);
  }

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === en), 900);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Listen and choose</p>
      <button
        type="button"
        onClick={handlePlay}
        aria-label="Play audio"
        title={
          hasBulgarianVoice === false
            ? "No Bulgarian voice is installed on this device -- this will likely be silent. On Windows: Settings → Time & Language → Language & region → Add a language → Bulgarian."
            : undefined
        }
        className={`flex h-16 w-16 items-center justify-center rounded-full text-white ${
          hasBulgarianVoice === false ? "bg-amber-500 hover:bg-amber-600" : "bg-stone-900 hover:bg-stone-700"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
          <path
            d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {hasBulgarianVoice === false && (
        <p className="max-w-xs text-xs text-amber-600">
          No Bulgarian voice found on this device -- playback will likely be silent.
        </p>
      )}
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
      {selected && <p className="text-lg font-semibold tracking-tight text-stone-700">{bg}</p>}
    </div>
  );
}
