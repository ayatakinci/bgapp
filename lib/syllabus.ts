// The full A1->B2 syllabus, as given -- kept separate from grammarTopics/
// lessons because it's reference/overview content (can-do statements,
// vocabulary blurbs, milestones), not a drillable unit. `topic` links a
// grammar line to a real grammar_topics.title where one exists, so the
// syllabus becomes a navigable checklist instead of static text.

export type SyllabusGrammarItem = {
  text: string;
  done: boolean;
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
      { text: "Cyrillic alphabet — all 30 letters, reading automatic", done: true },
      { text: "Personal pronouns (аз, ти, той…)", done: true },
      { text: "съм (to be) — present tense", done: true, topics: ['"To be" (съм)'] },
      { text: "Present tense of regular verbs — the three conjugation groups (-а, -и, -е endings)", done: true, topics: ["Present tense verb endings"] },
      { text: "Gender of nouns (masculine / feminine / neuter)", done: true },
      { text: "Plurals — basic patterns", done: true, topics: ["Plurals"] },
      { text: "Definite article (\"the\" as a tail: -ът/-та/-то/-те)", done: true, topics: ["Definite article"] },
      { text: "Numbers 0–100 + the masculine counting form (два лева)", done: true },
      { text: "Negation with не", done: true, topics: ["Negation"] },
      { text: "Yes/no questions with ли; basic question words (какво, къде, кой)", done: true, topics: ["Yes/no questions (ли)", "Question words"] },
      { text: "Telling time + days of the week", done: true },
      { text: "Adjective agreement (голям / голяма / голямо / големи)", done: false, topics: ["Adjectives and agreement"] },
      { text: "Demonstratives — този / тази / това / тези (this/these)", done: false, topics: ["This / that"] },
      { text: "Basic prepositions — в, на, от, с, за", done: false, topics: ["Prepositions"] },
      { text: "\"There is / there are\" — има / няма", done: false, topics: ['"Има / няма"'] },
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
        text: "Possessive pronouns — long (мой, твой, негов, неин, наш, ваш, техен) + short/clitic (ми, ти, му, ѝ, ни, ви, им): \"колата ми\" = my car",
        done: false,
        topics: ["Possession"],
      },
      { text: "Full vs. short definite article for masculine (столът / стола) — the writing rule", done: false, topics: ["Definite article"] },
      { text: "Modal verbs — мога (can), трябва (must/need), искам да (want to), може (may)", done: false, topics: ["Modal verbs"] },
      { text: "The да-construction (Bulgarian's \"subjunctive\" — replaces the infinitive): искам да ям", done: false, topics: ["Modal verbs"] },
      { text: "Dative \"experiencer\" constructions — харесва ми (I like), боли ме (it hurts me), студено ми е (I'm cold)", done: false, topics: ['"I like"'] },
      { text: "Future tense — ще + verb; negative future няма да", done: false, topics: ["Future tense"] },
      { text: "Past simple / Aorist (минало свършено време) — \"I did/said/ate\": говорих, ядох, отидох", done: false, topics: ["Past tense (basic)"] },
      { text: "Introduction to verbal aspect — perfective vs. imperfective pairs (пиша / напиша)", done: false, topics: ["Verbal aspect (intro)"] },
      { text: "Imperative — commands (кажи! чакай! елате!)", done: false, topics: ["Imperative (basic)"] },
      { text: "Comparative & superlative — по- (more) / най- (most): по-голям, най-добър", done: false, topics: ["Comparison of adjectives"] },
      { text: "Reflexive verbs with се (казвам се, намира се, чувствам се)", done: false, topics: ["Reflexive verbs"] },
      { text: "More prepositions — до, при, под, над, между, през, без", done: false, topics: ["Prepositions of time"] },
      { text: "Adverbs of frequency & manner (винаги, често, понякога, бавно, бързо)", done: false, topics: ["Adverbs"] },
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
      { text: "Verbal aspect in depth — choosing perfective vs. imperfective correctly (the big Slavic skill)", done: false, topics: ["Verbal aspect (intro)"] },
      { text: "Imperfect past (минало несвършено време) — \"I was doing / used to do\": четях, работех", done: false, topics: ["Aorist vs imperfect"] },
      { text: "Aorist vs. Imperfect — knowing which past tense to use", done: false, topics: ["Aorist vs imperfect"] },
      {
        text: "Present perfect (минало неопределено — съм + past participle): чел съм, ходил съм (\"I have read/been\")",
        done: false,
        topics: ["Present perfect (съм + participle)"],
      },
      { text: "Past active participles (чел, писал) — forming and using them", done: false, topics: ["Past active participles (-л forms)"] },
      { text: "Relative clauses — който / която / което / които (the man who…, the book that…)", done: false, topics: ["Relative clauses"] },
      { text: "Conditional — бих + past participle: бих искал (I would like)", done: false, topics: ["Conditional mood"] },
      { text: "Conditional sentences with ако (if) + future/past", done: false, topics: ['"Ако" (if) clauses'] },
      { text: "Clitic (short-pronoun) ordering rules & word order in the sentence", done: false, topics: ["Long vs short object pronouns"] },
      {
        text: "Direct & indirect object pronouns together (Give it to me = дай ми го)",
        done: false,
        topics: ["Combining direct & indirect object pronouns"],
      },
      { text: "Passive voice basics — with се and with participles", done: false, topics: ["Passive voice (basic)"] },
      { text: "Purpose, cause, result clauses — за да, защото, затова, така че", done: false, topics: ["Advanced connectors", "Connecting sentences"] },
      { text: "Reported/indirect speech basics (\"He said that…\")", done: false, topics: ["Reported speech (basic)"] },
      {
        text: "Prefixed verbs of motion (влизам, излизам, отивам, пристигам…)",
        done: false,
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
        text: "Renarrative mood (преизказно наклонение) — Bulgarian's famous \"reported/hearsay\" verb forms: той бил, казал, отишъл (\"he apparently went / they say he…\"). Distinctive, essential, and hard.",
        done: false,
        topics: ["Renarrated mood (intro)"],
      },
      { text: "Pluperfect (минало предварително време) — \"I had done\"", done: false, topics: ["Pluperfect (минало предварително време)"] },
      {
        text: "Future in the past & future perfect (щях да…, ще съм направил)",
        done: false,
        topics: ["Future in the past & future perfect"],
      },
      { text: "Full command of verbal aspect across all tenses and moods", done: false, topics: ["Verbal aspect (intro)"] },
      { text: "Present & past passive participles + full passive voice (написан, направен)", done: false, topics: ["Passive voice (basic)"] },
      {
        text: "Gerund / adverbial participle (деепричастие): четейки (while reading)",
        done: false,
        topics: ["Gerund / adverbial participle (деепричастие)"],
      },
      { text: "Complex conditional & hypothetical sentences (mixed real/unreal)", done: false, topics: ["Conditional mood"] },
      { text: "Nuanced reported speech + sequence of tenses", done: false, topics: ["Reported speech (basic)"] },
      { text: "Advanced clitic clusters and emphatic/marked word order", done: false, topics: ["Combining direct & indirect object pronouns"] },
      {
        text: "Nominalization and complex noun phrases",
        done: false,
        topics: ["Nominalization & complex noun phrases"],
      },
      {
        text: "Stylistic register — formal vs. colloquial vs. written Bulgarian",
        done: false,
        topics: ["Stylistic register: formal vs. colloquial"],
      },
      { text: "Fine-grained conjunctions & discourse markers (все пак, макар че, въпреки че, следователно)", done: false, topics: ["Advanced connectors"] },
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
