"use client";

// Uses the browser's built-in Web Speech API -- free, no server, no API
// key, no licensing question. The real caveat: Bulgarian voice quality
// and even availability depends entirely on the user's OS/browser (some
// combinations have no bg-BG voice installed and will fall back to a
// default voice, or stay silent). Not something we can fix from here.
export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // stop whatever was already playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "bg-BG";
  window.speechSynthesis.speak(utterance);
}

type Props = {
  text: string;
  className?: string;
};

export function SpeakButton({ text, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speak(text);
      }}
      aria-label={`Listen: ${text}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
        <path
          d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
