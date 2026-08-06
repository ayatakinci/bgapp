"use client";

import { useState } from "react";

type Props = {
  bg: string;
  en: string;
  onAnswer: (correct: boolean) => void;
};

export function Flashcard({ bg, en, onAnswer }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div>
      <p>{bg}</p>
      {showAnswer ? (
        <>
          <p>{en}</p>
          <button onClick={() => onAnswer(true)}>Correct</button>
          <button onClick={() => onAnswer(false)}>Wrong</button>
        </>
      ) : (
        <button onClick={() => setShowAnswer(true)}>Show answer</button>
      )}
    </div>
  );
}
