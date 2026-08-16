// Structured version of Part C (survival vocabulary) from the roadmap.
// Single words get looked up in Wiktionary for a real definition, same
// quality bar as the rest of the word list; phrases and numbers are
// hand-supplied since they're either compositional (numbers) or simple
// enough that a lookup adds risk (wrong Wiktionary sense) without benefit.

export const DOMAIN_SINGLE_WORDS: Record<string, string[]> = {
  "Greetings & politeness": ["здравей", "благодаря", "моля", "извинете", "довиждане"],
  "About me": ["от", "живея", "работя", "програмист", "език"],
  "Family & people": ["майка", "баща", "приятел", "жена", "мъж", "дете"],
  "Food & drink": ["вода", "кафе", "чай", "хляб", "мляко", "сирене", "месо", "ябълка"],
  "Shopping & money": ["лев", "скъпо", "евтино", "пари", "искам"],
  "Numbers & time": ["час", "ден", "седмица", "днес", "утре", "вчера", "сега"],
  "Days & months": [
    "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя",
    "януари", "февруари", "март", "април", "май", "юни",
    "юли", "август", "септември", "октомври", "ноември", "декември",
  ],
  "City & directions": ["улица", "площад", "ляво", "дясно", "направо", "тук", "там", "къде"],
  "Common verbs": [
    "съм", "имам", "искам", "мога", "трябва", "говоря", "разбирам", "знам",
    "отивам", "правя", "ям", "пия", "живея", "работя", "обичам",
  ],
  "Common adjectives": ["голям", "малък", "добър", "лош", "хубав", "нов", "стар", "топъл", "студен"],
  "Question words": ["кой", "какво", "къде", "кога", "защо", "как", "колко"],
  "Emergencies & health": ["помощ", "боли", "лекар", "аптека", "болница"],
};

export const DOMAIN_PHRASES: Record<string, { bg: string; en: string }[]> = {
  "Greetings & politeness": [{ bg: "добър ден", en: "good day" }],
  "About me": [{ bg: "казвам се", en: "my name is / I am called" }],
  "Shopping & money": [
    { bg: "колко струва", en: "how much does it cost" },
    { bg: "имате ли", en: "do you have" },
  ],
  "Numbers & time": [
    { bg: "нула", en: "zero" }, { bg: "едно", en: "one" }, { bg: "две", en: "two" },
    { bg: "три", en: "three" }, { bg: "четири", en: "four" }, { bg: "пет", en: "five" },
    { bg: "шест", en: "six" }, { bg: "седем", en: "seven" }, { bg: "осем", en: "eight" },
    { bg: "девет", en: "nine" }, { bg: "десет", en: "ten" },
    { bg: "единайсет", en: "eleven" }, { bg: "дванайсет", en: "twelve" },
    { bg: "трийсет", en: "thirty" }, { bg: "четирийсет", en: "forty" },
    { bg: "петдесет", en: "fifty" }, { bg: "шейсет", en: "sixty" },
    { bg: "седемдесет", en: "seventy" }, { bg: "осемдесет", en: "eighty" },
    { bg: "деветдесет", en: "ninety" }, { bg: "сто", en: "one hundred" },
  ],
};

export const DOMAIN_ORDER = [
  "Greetings & politeness",
  "About me",
  "Family & people",
  "Food & drink",
  "Shopping & money",
  "Numbers & time",
  "Days & months",
  "City & directions",
  "Common verbs",
  "Common adjectives",
  "Question words",
  "Emergencies & health",
];
