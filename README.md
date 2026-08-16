# bgapp

A small, open Bulgarian vocabulary trainer — flashcards and spaced repetition,
built as a learning project to go deep on the full stack behind it (Next.js,
TypeScript, Postgres, Drizzle) rather than to ship as fast as possible.

## Stack

- **Next.js 16** (App Router) — full-stack: pages, API layer, and Server
  Actions all live in the same app
- **TypeScript**
- **Tailwind CSS v4**
- **Postgres 17**, running in Docker locally
- **Drizzle ORM** + `drizzle-kit` for schema, migrations, and queries
- **postgres.js** as the underlying database driver

## Features

- 500 real Bulgarian words, imported from open data (see **Data sources**
  below) — not scraped from any commercial app
- Lessons and a lesson picker, grouping words for structured browsing
- A spaced-repetition review queue (a simplified SM-2 algorithm, the same
  family of algorithm behind Anki) that schedules words based on whether you
  got them right or wrong
- Flashcard review flow, backed by a Server Action that persists each answer

## Getting started

### Prerequisites

- Node.js
- Docker Desktop

### Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
DATABASE_URL=postgres://bgapp:bgapp@localhost:5432/bgapp
```

Start Postgres:

```bash
docker compose up -d
```

Run migrations:

```bash
npx drizzle-kit migrate
```

Start the dev server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Populating data

The database starts empty. These one-off scripts populate it (each is a
plain TypeScript file, run with `tsx`, not a long-running server):

```bash
# Import ~500 real Bulgarian words from open data sources
npx tsx lib/db/ingest.mts

# Group the imported words into lessons
npx tsx lib/db/seed-lessons.mts
```

## Project structure

```
app/                      routes (pages, layouts, Server Actions boundary)
  lessons/                lesson list + lesson detail pages
  review/                 the flashcard review flow
  words/                  full word list
  components/flashcards/  Flashcard, FlashcardDeck (client components)
lib/
  db/
    schema.ts             Drizzle schema — all tables
    index.ts              the Drizzle client used at runtime
    reviews.ts            due/new word queries, answer recording
    ingest.mts            imports real vocabulary from open data
    seed-lessons.mts      groups imported words into lessons
  srs.ts                  the spaced-repetition algorithm (pure function)
  actions.ts              Server Actions (e.g. submitAnswer)
drizzle/                  generated SQL migrations + schema snapshots
docker-compose.yml        local Postgres
```

## Data sources

Vocabulary is built from open-licensed sources only, not scraped from any
paid app:

- **[FrequencyWords](https://github.com/hermitdave/FrequencyWords)** by
  Hermit Dave (MIT) — used to prioritize which words are worth teaching
  first, based on real-world usage frequency
- **[Wiktionary](https://www.wiktionary.org/) via [kaikki.org](https://kaikki.org)**
  (CC BY-SA) — used for English definitions and part-of-speech

### Known data quality limitations

- The import takes the first Wiktionary sense/gloss found per word, which is
  sometimes a rare or technical meaning rather than the common one
- The frequency list is sourced from subtitle data, so a handful of
  slang/vulgar words are mixed in among genuinely common vocabulary

Neither is fixed yet — see the code comments in `lib/db/ingest.mts` for
where this would need to change (a curated blocklist, better sense
selection) before this is used by anyone beyond development/testing.

## Status

Currently working: schema, real vocabulary import, spaced repetition
scheduling, flashcard review, lesson browsing, and real user
accounts (signup/login/logout, hashed passwords, database-backed
sessions, protected routes via `proxy.ts`).

Not yet built: additional exercise types beyond flip-card review,
email verification/password reset, deployment.
