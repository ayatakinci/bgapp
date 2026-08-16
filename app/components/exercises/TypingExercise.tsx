"use client";

import { useState, type SubmitEvent } from "react";

type Props = {
  bg: string;
  en: string;
  onAnswer: (correct: boolean) => void;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function TypingExercise({ bg, en, onAnswer }: Props) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (submitted) return;

    const correct = normalize(value) === normalize(bg);
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onAnswer(correct), 1200);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
      <p className="text-lg text-stone-600">{en}</p>
      <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitted}
          autoFocus
          placeholder="Type the Bulgarian word"
          className={`w-full rounded-md border px-3 py-2 text-center text-xl font-medium ${
            submitted
              ? isCorrect
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-rose-600 bg-rose-50 text-rose-700"
              : "border-stone-300"
          }`}
        />
        {!submitted && (
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Check
          </button>
        )}
      </form>
      {submitted && !isCorrect && (
        <p className="text-sm text-stone-500">
          Correct answer: <span className="font-medium text-stone-700">{bg}</span>
        </p>
      )}
    </div>
  );
}
