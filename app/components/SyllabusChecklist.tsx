"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleSyllabusItem } from "@/lib/actions";
import { MOTIVATIONAL_MESSAGES } from "@/lib/syllabus";

type Item = {
  id: string;
  text: string;
  links: { id: number; title: string }[];
};

type Props = {
  items: Item[];
  initialChecked: string[];
  loggedIn: boolean;
};

function pickMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

export function SyllabusChecklist({ items, initialChecked, loggedIn }: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initialChecked));
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const percent = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0;

  function handleToggle(itemId: string) {
    if (!loggedIn) return;

    const willBeChecked = !checked.has(itemId);
    setChecked((prev) => {
      const next = new Set(prev);
      if (willBeChecked) next.add(itemId);
      else next.delete(itemId);
      return next;
    });

    if (willBeChecked) {
      setMessage(pickMessage());
    } else {
      setMessage(null);
    }

    startTransition(async () => {
      try {
        await toggleSyllabusItem(itemId, willBeChecked);
      } catch {
        // Roll back on failure (e.g. session expired mid-click).
        setChecked((prev) => {
          const next = new Set(prev);
          if (willBeChecked) next.delete(itemId);
          else next.add(itemId);
          return next;
        });
      }
    });
  }

  return (
    <div>
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
          <span>
            {checked.size} / {items.length} checked
          </span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        {message && (
          <p className="mt-2 text-xs font-medium text-emerald-700" role="status">
            {message}
          </p>
        )}
        {!loggedIn && (
          <p className="mt-2 text-xs text-stone-400">
            <Link href="/login" className="underline hover:text-stone-600">
              Log in
            </Link>{" "}
            to track your progress through the checklist.
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <li key={item.id} className="flex items-start gap-2 text-sm">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={!loggedIn}
                aria-pressed={isChecked}
                aria-label={item.text}
                className={`mt-0.5 shrink-0 ${loggedIn ? "cursor-pointer" : "cursor-default"} ${
                  isChecked ? "text-emerald-600" : "text-stone-300"
                }`}
              >
                {isChecked ? "☑" : "☐"}
              </button>
              <span className="flex-1 text-stone-700">
                {item.text}
                {item.links.length > 0 && (
                  <span className="ml-2 inline-flex flex-wrap gap-1">
                    {item.links.map((l) => (
                      <Link
                        key={l.id}
                        href={`/grammar/${l.id}`}
                        className="rounded-full border border-stone-300 px-2 py-0.5 text-xs font-medium text-stone-600 hover:border-stone-500 hover:text-stone-900"
                      >
                        Practice →
                      </Link>
                    ))}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
