"use client";

import { useState } from "react";
import { SpeakButton } from "@/app/components/SpeakButton";

type Props = {
  bg: string;
  en: string;
  onAnswer: (correct: boolean) => void;
};

export function Flashcard({ bg, en, onAnswer }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <div className="flex items-center gap-2">
        <p className="text-3xl font-semibold tracking-tight">{bg}</p>
        <SpeakButton text={bg} />
      </div>
      {showAnswer ? (
        <>
          <p className="text-lg text-stone-600">{en}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onAnswer(true)}
              className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Correct
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="rounded-md bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              Wrong
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setShowAnswer(true)}
          className="rounded-md border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Show answer
        </button>
      )}
    </div>
  );
}
