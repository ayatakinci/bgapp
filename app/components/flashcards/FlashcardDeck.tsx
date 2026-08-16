"use client";

import { useMemo, useState } from "react";
import { Flashcard } from "./Flashcard";
import { ChoiceGame } from "../exercises/ChoiceGame";
import { submitAnswer } from "@/lib/actions";

type Word = { id: number; bg: string; en: string };

type Props = {
  words: Word[];
  userId: number;
  distractorPool: string[];
};

export function FlashcardDeck({ words, userId, distractorPool }: Props) {
  const [index, setIndex] = useState(0);

  // Decide each card's exercise type once, up front -- not on every
  // render, or it would reshuffle every time this component re-renders.
  const exerciseTypes = useMemo(
    () => words.map(() => (Math.random() < 0.5 ? "flashcard" : "choice")),
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
      {type === "flashcard" ? (
        <Flashcard key={current.id} bg={current.bg} en={current.en} onAnswer={handleAnswer} />
      ) : (
        <ChoiceGame
          key={current.id}
          bg={current.bg}
          en={current.en}
          distractors={distractorPool}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}
