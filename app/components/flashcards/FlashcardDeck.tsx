"use client";

import { useState } from "react";
import { Flashcard } from "./Flashcard";
import { submitAnswer } from "@/lib/actions";

type Word = { id: number; bg: string; en: string };

type Props = {
  words: Word[];
  userId: number;
};

export function FlashcardDeck({ words, userId }: Props) {
  const [index, setIndex] = useState(0);

  if (words.length === 0) {
    return <p>No words to review right now.</p>;
  }

  if (index >= words.length) {
    return <p>Session complete!</p>;
  }

  const current = words[index];

  async function handleAnswer(correct: boolean) {
    await submitAnswer(userId, current.id, correct);
    setIndex((i) => i + 1);
  }

  return (
    <Flashcard key={current.id} bg={current.bg} en={current.en} onAnswer={handleAnswer} />
  );
}
