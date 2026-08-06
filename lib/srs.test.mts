import { nextReviewState, type ReviewState } from "./srs";

let state: ReviewState = { interval: 0, easeFactor: 2.5, repetitions: 0 };

console.log("Five correct answers in a row:");
for (let i = 0; i < 5; i++) {
  const result = nextReviewState(state, true);
  console.log(
    `  rep ${result.repetitions}: interval=${result.interval}d, ease=${result.easeFactor.toFixed(2)}`
  );
  state = result;
}

console.log("\nThen one wrong answer:");
const afterMiss = nextReviewState(state, false);
console.log(
  `  rep ${afterMiss.repetitions}: interval=${afterMiss.interval}d, ease=${afterMiss.easeFactor.toFixed(2)}`
);
