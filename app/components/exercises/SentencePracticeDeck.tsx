"use client";

import { useMemo, useState } from "react";
import { Flashcard } from "../flashcards/Flashcard";
import { ChoiceGame } from "./ChoiceGame";
import { SentenceFillBlank } from "./SentenceFillBlank";

type Sentence = { id: number; bg: string; en: string; matchedWord: string };

type Props = {
  sentences: Sentence[];
  wordDistractorPool: string[]; // words.bg values, for fill-blank options
};

const EXERCISE_TYPES = ["flashcard", "choice", "fillBlank"] as const;

// Same hydration-mismatch-avoidance pattern as FlashcardDeck: derive the
// exercise-type pick from something stable (the sentence's own id)
// instead of Math.random(), since this Client Component's first render
// happens on the server and must agree with the browser's hydration pass.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function SentencePracticeDeck({ sentences, wordDistractorPool }: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const exerciseTypes = useMemo(
    () => sentences.map((s) => EXERCISE_TYPES[hashString(String(s.id)) % EXERCISE_TYPES.length]),
    [sentences]
  );

  const sentenceTranslations = useMemo(() => sentences.map((s) => s.en), [sentences]);

  if (sentences.length === 0) {
    return <p className="text-stone-500">No sentences to practice for this lesson yet.</p>;
  }

  if (index >= sentences.length) {
    return (
      <p className="text-lg font-medium text-stone-700">
        Done! {correctCount} / {sentences.length} correct. 🎉
      </p>
    );
  }

  const current = sentences[index];
  const type = exerciseTypes[index];

  function handleAnswer(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-stone-400">
        {index + 1} / {sentences.length}
      </p>
      {type === "flashcard" && (
        <Flashcard key={current.id} bg={current.bg} en={current.en} onAnswer={handleAnswer} />
      )}
      {type === "choice" && (
        <ChoiceGame
          key={current.id}
          bg={current.bg}
          en={current.en}
          distractors={sentenceTranslations}
          onAnswer={handleAnswer}
        />
      )}
      {type === "fillBlank" && (
        <SentenceFillBlank
          key={current.id}
          bg={current.bg}
          en={current.en}
          matchedWord={current.matchedWord}
          distractors={wordDistractorPool}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}
