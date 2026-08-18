// The full A1->B2 syllabus, as given -- kept separate from grammarTopics/
// lessons because it's reference/overview content (can-do statements,
// vocabulary blurbs, milestones), not a drillable unit. `topics` links a
// grammar line to real grammar_topics.title values where they exist, so
// the syllabus becomes a navigable checklist instead of static text.
//
// Each grammar item's `id` is a stable key used for per-user progress
// tracking (syllabus_progress.item_id) -- it must never change once a
// user could have checked it, or their progress silently resets.

export type SyllabusGrammarItem = {
  id: string;
  text: string;
  topics?: string[]; // grammar_topics.title values this line covers
};

export type LevelSyllabus = {
  level: "A1" | "A2" | "B1" | "B2";
  name: string;
  emoji: string;
  grammar: SyllabusGrammarItem[];
  canDo: string[];
  vocabulary: string;
  vocabularyCount: string;
  milestone: string;
};

export const SYLLABUS: LevelSyllabus[] = [
  {
    level: "A1",
    name: "Survival",
    emoji: "🟢",
    grammar: [
      { id: "a1-alphabet", text: "Cyrillic alphabet — all 30 letters, reading automatic", topics: ["Cyrillic alphabet"] },
      { id: "a1-pronouns", text: "Personal pronouns (аз, ти, той…)", topics: ["Personal pronouns"] },
      { id: "a1-sum", text: "съм (to be) — present tense", topics: ['"To be" (съм)'] },
      { id: "a1-present-tense", text: "Present tense of regular verbs — the three conjugation groups (-а, -и, -е endings)", topics: ["Present tense verb endings"] },
      { id: "a1-gender", text: "Gender of nouns (masculine / feminine / neuter)" },
      { id: "a1-plurals", text: "Plurals — basic patterns", topics: ["Plurals"] },
      { id: "a1-definite-article", text: "Definite article (\"the\" as a tail: -ът/-та/-то/-те)", topics: ["Definite article"] },
      { id: "a1-numbers", text: "Numbers 0–100 + the masculine counting form (два лева)" },
      { id: "a1-negation", text: "Negation with не", topics: ["Negation"] },
      { id: "a1-questions", text: "Yes/no questions with ли; basic question words (какво, къде, кой)", topics: ["Yes/no questions (ли)", "Question words"] },
      { id: "a1-time-days", text: "Telling time + days of the week" },
      { id: "a1-adjectives", text: "Adjective agreement (голям / голяма / голямо / големи)", topics: ["Adjectives and agreement"] },
      { id: "a1-demonstratives", text: "Demonstratives — този / тази / това / тези (this/these)", topics: ["This / that"] },
      { id: "a1-prepositions", text: "Basic prepositions — в, на, от, с, за", topics: ["Prepositions"] },
      { id: "a1-there-is", text: "\"There is / there are\" — има / няма", topics: ['"Има / няма"'] },
    ],
    canDo: [
      "Greet, say goodbye, be polite",
      "Introduce yourself: name, nationality, job, languages, where you live",
      "Order food and drink; shop and ask prices",
      "Count, handle money, tell the time, name the days",
      "Ask and answer very simple questions",
      "Fill in a basic form with personal details",
    ],
    vocabulary:
      "Greetings & politeness · personal info · family basics · food & drink · shopping & money · numbers & time · days & months · colors · the body basics · common verbs (top ~40) · common adjectives · question words · the classroom/learning words.",
    vocabularyCount: "~500–800 words",
    milestone: "Introduce yourself, shop, order, tell the time, and pass the citizenship language exam.",
  },
  {
    level: "A2",
    name: "Everyday",
    emoji: "🟡",
    grammar: [
      {
        id: "a2-possessives",
        text: "Possessive pronouns — long (мой, твой, негов, неин, наш, ваш, техен) + short/clitic (ми, ти, му, ѝ, ни, ви, им): \"колата ми\" = my car",
        topics: ["Possession"],
      },
      { id: "a2-definite-article-full", text: "Full vs. short definite article for masculine (столът / стола) — the writing rule", topics: ["Definite article"] },
      { id: "a2-modals", text: "Modal verbs — мога (can), трябва (must/need), искам да (want to), може (may)", topics: ["Modal verbs"] },
      { id: "a2-da-construction", text: "The да-construction (Bulgarian's \"subjunctive\" — replaces the infinitive): искам да ям", topics: ["Modal verbs"] },
      { id: "a2-dative-experiencer", text: "Dative \"experiencer\" constructions — харесва ми (I like), боли ме (it hurts me), студено ми е (I'm cold)", topics: ['"I like"'] },
      { id: "a2-future", text: "Future tense — ще + verb; negative future няма да", topics: ["Future tense"] },
      { id: "a2-aorist", text: "Past simple / Aorist (минало свършено време) — \"I did/said/ate\": говорих, ядох, отидох", topics: ["Past tense (basic)"] },
      { id: "a2-aspect-intro", text: "Introduction to verbal aspect — perfective vs. imperfective pairs (пиша / напиша)", topics: ["Verbal aspect (intro)"] },
      { id: "a2-imperative", text: "Imperative — commands (кажи! чакай! елате!)", topics: ["Imperative (basic)"] },
      { id: "a2-comparison", text: "Comparative & superlative — по- (more) / най- (most): по-голям, най-добър", topics: ["Comparison of adjectives"] },
      { id: "a2-reflexive", text: "Reflexive verbs with се (казвам се, намира се, чувствам се)", topics: ["Reflexive verbs"] },
      { id: "a2-more-prepositions", text: "More prepositions — до, при, под, над, между, през, без", topics: ["Prepositions of time"] },
      { id: "a2-adverbs", text: "Adverbs of frequency & manner (винаги, често, понякога, бавно, бързо)", topics: ["Adverbs"] },
    ],
    canDo: [
      "Describe people, places, and things in simple terms",
      "Talk about your daily routine and habits",
      "Talk about the past — what you did yesterday / last week",
      "Talk about the future — plans, intentions",
      "Say what you like, want, need, can, and must do",
      "Make appointments and arrangements; handle simple phone calls",
      "Ask for and follow directions",
      "Shop in more detail, describe problems (\"this doesn't work\")",
      "Talk about health basics at the pharmacy/doctor",
    ],
    vocabulary:
      "Home & furniture · city & transport · directions · work & professions · daily activities · food shopping & cooking · clothing · weather & seasons · health & body · feelings basics · leisure & hobbies · travel basics · larger numbers, dates, ordinals.",
    vocabularyCount: "~1,000–1,500 cumulative",
    milestone: "Handle everyday errands and routines; talk about past and future; describe your life simply.",
  },
  {
    level: "B1",
    name: "Independent",
    emoji: "🟠",
    grammar: [
      { id: "b1-aspect-depth", text: "Verbal aspect in depth — choosing perfective vs. imperfective correctly (the big Slavic skill)", topics: ["Verbal aspect (intro)"] },
      { id: "b1-imperfect", text: "Imperfect past (минало несвършено време) — \"I was doing / used to do\": четях, работех", topics: ["Aorist vs imperfect"] },
      { id: "b1-aorist-vs-imperfect", text: "Aorist vs. Imperfect — knowing which past tense to use", topics: ["Aorist vs imperfect"] },
      {
        id: "b1-present-perfect",
        text: "Present perfect (минало неопределено — съм + past participle): чел съм, ходил съм (\"I have read/been\")",
        topics: ["Present perfect (съм + participle)"],
      },
      { id: "b1-participles", text: "Past active participles (чел, писал) — forming and using them", topics: ["Past active participles (-л forms)"] },
      { id: "b1-relative-clauses", text: "Relative clauses — който / която / което / които (the man who…, the book that…)", topics: ["Relative clauses"] },
      { id: "b1-conditional", text: "Conditional — бих + past participle: бих искал (I would like)", topics: ["Conditional mood"] },
      { id: "b1-ako-clauses", text: "Conditional sentences with ако (if) + future/past", topics: ['"Ако" (if) clauses'] },
      { id: "b1-clitic-ordering", text: "Clitic (short-pronoun) ordering rules & word order in the sentence", topics: ["Long vs short object pronouns"] },
      {
        id: "b1-object-pronouns-combo",
        text: "Direct & indirect object pronouns together (Give it to me = дай ми го)",
        topics: ["Combining direct & indirect object pronouns"],
      },
      { id: "b1-passive-intro", text: "Passive voice basics — with се and with participles", topics: ["Passive voice (basic)"] },
      { id: "b1-purpose-clauses", text: "Purpose, cause, result clauses — за да, защото, затова, така че", topics: ["Advanced connectors", "Connecting sentences"] },
      { id: "b1-reported-speech-basic", text: "Reported/indirect speech basics (\"He said that…\")", topics: ["Reported speech (basic)"] },
      {
        id: "b1-motion-verbs",
        text: "Prefixed verbs of motion (влизам, излизам, отивам, пристигам…)",
        topics: ["Prefixed verbs of motion"],
      },
    ],
    canDo: [
      "Hold a conversation on familiar topics without much strain",
      "Narrate a story or experience with a clear sequence of events",
      "Give and justify opinions, plans, hopes, and dreams",
      "Handle most situations while traveling or dealing with officials",
      "Describe events, ambitions, and give reasons and explanations",
      "Write a simple connected text (a letter, an email, a short story)",
      "Understand the main points of clear standard speech and simple media",
      "Deal with the unexpected — complaints, misunderstandings, problems",
    ],
    vocabulary:
      "Abstract feelings & opinions · work & career in detail · education · money & banking · technology & internet · media & news basics · relationships & society · nature & environment · culture & traditions · common idioms & set phrases · connectors and discourse words.",
    vocabularyCount: "~2,500–3,000 cumulative",
    milestone: "Live independently in Bulgarian — converse, narrate, explain, and handle real-life problems.",
  },
  {
    level: "B2",
    name: "Fluent-ish (upper independent)",
    emoji: "🔴",
    grammar: [
      {
        id: "b2-renarrative",
        text: "Renarrative mood (преизказно наклонение) — Bulgarian's famous \"reported/hearsay\" verb forms: той бил, казал, отишъл (\"he apparently went / they say he…\"). Distinctive, essential, and hard.",
        topics: ["Renarrated mood (intro)"],
      },
      { id: "b2-pluperfect", text: "Pluperfect (минало предварително време) — \"I had done\"", topics: ["Pluperfect (минало предварително време)"] },
      {
        id: "b2-future-past",
        text: "Future in the past & future perfect (щях да…, ще съм направил)",
        topics: ["Future in the past & future perfect"],
      },
      { id: "b2-aspect-full", text: "Full command of verbal aspect across all tenses and moods", topics: ["Verbal aspect (intro)"] },
      { id: "b2-passive-full", text: "Present & past passive participles + full passive voice (написан, направен)", topics: ["Passive voice (basic)"] },
      {
        id: "b2-gerund",
        text: "Gerund / adverbial participle (деепричастие): четейки (while reading)",
        topics: ["Gerund / adverbial participle (деепричастие)"],
      },
      { id: "b2-conditional-complex", text: "Complex conditional & hypothetical sentences (mixed real/unreal)", topics: ["Conditional mood"] },
      { id: "b2-reported-speech-nuanced", text: "Nuanced reported speech + sequence of tenses", topics: ["Reported speech (basic)"] },
      { id: "b2-clitic-advanced", text: "Advanced clitic clusters and emphatic/marked word order", topics: ["Combining direct & indirect object pronouns"] },
      {
        id: "b2-nominalization",
        text: "Nominalization and complex noun phrases",
        topics: ["Nominalization & complex noun phrases"],
      },
      {
        id: "b2-register",
        text: "Stylistic register — formal vs. colloquial vs. written Bulgarian",
        topics: ["Stylistic register: formal vs. colloquial"],
      },
      { id: "b2-connectors", text: "Fine-grained conjunctions & discourse markers (все пак, макар че, въпреки че, следователно)", topics: ["Advanced connectors"] },
    ],
    canDo: [
      "Interact with fluency and spontaneity, including with native speakers",
      "Discuss abstract and complex topics; follow an argument",
      "Present clear, detailed viewpoints and defend a position",
      "Understand most TV, news, films, and podcasts in standard Bulgarian",
      "Read newspapers, articles, and contemporary prose with ease",
      "Write clear, detailed texts — essays, reports, formal correspondence",
      "Adjust your language to the situation (formal, casual, professional)",
      "Catch nuance, tone, irony, and the renarrative \"I didn't witness this\" flavor",
    ],
    vocabulary:
      "Abstract & academic vocabulary · politics, economy, law · science & health in depth · arts & literature · workplace & professional jargon · idioms, proverbs, and colloquialisms · emotional & psychological nuance · regional and stylistic variation.",
    vocabularyCount: "~4,000–5,000 cumulative",
    milestone: "Use Bulgarian fluently and flexibly for social, academic, and professional life.",
  },
];

export const DISTINCTIVE_FEATURES: { title: string; body: string }[] = [
  {
    title: "No noun cases",
    body: "Unlike Russian/Polish. A huge relief — word endings barely change for nouns.",
  },
  {
    title: "The postposed definite article",
    body: "\"The\" is a tail, not a word (масата, not \"the маса\"). Unique among Slavic languages.",
  },
  {
    title: "Verbal aspect",
    body: "Perfective/imperfective — the single biggest ongoing challenge; every verb has two \"modes.\" Starts at A2, mastered around B2.",
  },
  {
    title: "The renarrative mood",
    body: "Special verb forms for things you didn't personally witness (\"apparently, they say…\"). Almost no other European language grammaticalizes this. A B2 landmark.",
  },
  {
    title: "Rich past-tense system",
    body: "Aorist, imperfect, perfect, pluperfect, each with a job. Built up across A2–B2.",
  },
  {
    title: "Clitic word-order rules",
    body: "The little pronouns (ми, го, се, ли, ще) follow strict placement rules. A B1 focus.",
  },
];

export const MOTIVATIONAL_MESSAGES: string[] = [
  "Nice work — that's one more piece of the puzzle in place.",
  "Keep going, you're building real momentum.",
  "That's exactly how fluency gets built: one topic at a time.",
  "Solid. Your future self will thank you for this one.",
  "Progress, not perfection — and that's progress.",
  "One step closer to speaking Bulgarian without translating in your head.",
  "You'll be surprised how often that one comes up in real conversation.",
  "That's a genuinely tricky one for English speakers — well done.",
  "Every checkbox is a sentence you'll understand later that you wouldn't have before.",
  "Great pace. Consistency beats intensity here.",
  "Now go find it in a real sentence somewhere and notice it.",
  "That's the kind of detail that separates textbook Bulgarian from real Bulgarian.",
];
