"use client";

import { useEffect, useState } from "react";

// Uses the browser's built-in Web Speech API -- free, no server, no API
// key, no licensing question. The real caveat: Bulgarian voice quality
// and even availability depends entirely on the user's OS/browser -- some
// setups (a fresh Windows install is the common case) have no Bulgarian
// voice at all, only English ones. The browser will still "succeed" --
// onstart/onend both fire -- but an English voice reading Cyrillic text
// typically produces no audible sound, so it looks broken with no error
// anywhere. hasBulgarianVoice()/getBulgarianVoiceInfo() below exist so the
// UI can tell the difference between "broken" and "no BG voice installed".

let voicesCache: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  voicesCache = window.speechSynthesis.getVoices();
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  // Voice lists load asynchronously in most browsers -- empty on the very
  // first call, populated once this event fires.
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function findBulgarianVoice(): SpeechSynthesisVoice | undefined {
  return voicesCache.find((v) => v.lang.toLowerCase().startsWith("bg"));
}

// null = voice list not loaded yet, so we don't know; true/false once we do.
export function useHasBulgarianVoice(): boolean | null {
  const [hasVoice, setHasVoice] = useState<boolean | null>(() =>
    voicesCache.length > 0 ? Boolean(findBulgarianVoice()) : null
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    function check() {
      refreshVoices();
      setHasVoice(Boolean(findBulgarianVoice()));
    }
    if (voicesCache.length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", check);
      // Some browsers never fire voiceschanged if the list was already
      // ready internally -- this catches that case.
      const timeout = setTimeout(check, 500);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", check);
        clearTimeout(timeout);
      };
    } else {
      check();
    }
  }, []);

  return hasVoice;
}

export function speak(text: string, rate = 1) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop whatever was already playing

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "bg-BG";
  utterance.rate = rate;
  const bgVoice = findBulgarianVoice();
  if (bgVoice) utterance.voice = bgVoice;

  // Chrome has a known race condition where speak() called in the same
  // tick right after cancel() can be silently dropped.
  setTimeout(() => synth.speak(utterance), 0);
}

type Props = {
  text: string;
  className?: string;
};

export function SpeakButton({ text, className = "" }: Props) {
  const hasBulgarianVoice = useHasBulgarianVoice();
  const noVoiceWarning =
    hasBulgarianVoice === false
      ? "No Bulgarian voice is installed on this device, so this will likely be silent or badly mispronounced. On Windows: Settings → Time & Language → Language & region → Add a language → Bulgarian (this installs a Bulgarian voice too)."
      : undefined;

  return (
    <span className={`inline-flex shrink-0 items-center gap-0.5 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          speak(text);
        }}
        aria-label={`Listen: ${text}`}
        title={noVoiceWarning}
        className={`inline-flex items-center justify-center rounded-full p-1 hover:bg-stone-100 ${
          noVoiceWarning ? "text-amber-500 hover:text-amber-600" : "text-stone-400 hover:text-stone-700"
        }`}
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
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          speak(text, 0.5);
        }}
        aria-label={`Listen slowly: ${text}`}
        title={noVoiceWarning ?? "Play at half speed"}
        className={`rounded-full px-1 text-[10px] font-semibold hover:bg-stone-100 ${
          noVoiceWarning ? "text-amber-500 hover:text-amber-600" : "text-stone-400 hover:text-stone-700"
        }`}
      >
        0.5×
      </button>
    </span>
  );
}
