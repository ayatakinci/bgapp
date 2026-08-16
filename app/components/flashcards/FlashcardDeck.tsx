"use client";

import { useMemo, useState } from "react";
import { Flashcard } from "./Flashcard";
import { ChoiceGame } from "../exercises/ChoiceGame";
import { TypingExercise } from "../exercises/TypingExercise";
import { submitAnswer } from "@/lib/actions";

type Word = { id: number; bg: string; en: string };

type Props = {
  words: Word[];
  userId: number;
  distractorPool: string[];
};

const EXERCISE_TYPES = ["flashcard", "choice", "typing"] as const;

// Same hydration-mismatch fix as ChoiceGame's shuffle: this used to call
// Math.random() during render, which a Client Component runs once on the
// server (for the initial HTML) and once again in the browser during
// hydration -- two different random picks for the same word means two
// different components rendered at the same position, which React flags
// as a mismatch. Deriving the pick from the word's own stable id instead
// makes both passes agree.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function FlashcardDeck({ words, userId, distractorPool }: Props) {
  const [index, setIndex] = useState(0);

  const exerciseTypes = useMemo(
    () => words.map((w) => EXERCISE_TYPES[hashString(String(w.id)) % EXERCISE_TYPES.length]),
    [words]
  );

  if (words.length === 0) {
    return <p className="text-stone-500">No words to review right now.</p>;
  }

  if (index >= words.length) {
    return <p className="text-lg font-medium text-stone-700">Session complete! 🎉</p>;
  }

  const current = words[index];
  const type = exerciseTypes[index];

  async function handleAnswer(correct: boolean) {
    await submitAnswer(userId, current.id, correct);
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-stone-400">
        {index + 1} / {words.length}
      </p>
      {type === "flashcard" && (
        <Flashcard key={current.id} bg={current.bg} en={current.en} onAnswer={handleAnswer} />
      )}
      {type === "choice" && (
        <ChoiceGame
          key={current.id}
          bg={current.bg}
          en={current.en}
          distractors={distractorPool}
          onAnswer={handleAnswer}
        />
      )}
      {type === "typing" && (
        <TypingExercise key={current.id} bg={current.bg} en={current.en} onAnswer={handleAnswer} />
      )}
    </div>
  );
}
