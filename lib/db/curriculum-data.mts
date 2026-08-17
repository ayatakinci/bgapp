// Structured version of Part C (survival vocabulary) from the roadmap.
// Single words get looked up in Wiktionary for a real definition, same
// quality bar as the rest of the word list; phrases and numbers are
// hand-supplied since they're either compositional (numbers) or simple
// enough that a lookup adds risk (wrong Wiktionary sense) without benefit.
//
// Expanded 2026-08-17 with more common/useful vocabulary per domain, past
// just the roadmap's own literal examples.

export const DOMAIN_SINGLE_WORDS: Record<string, string[]> = {
  "Greetings & politeness": [
    "здравей", "благодаря", "моля", "извинете", "довиждане", "чао", "да", "не", "наздраве",
  ],
  "About me": [
    "от", "живея", "работя", "програмист", "език", "име", "семейство", "женен", "омъжена",
    "студент", "ученик", "учител", "инженер", "българия", "турция", "софия",
  ],
  "Family & people": [
    "майка", "баща", "приятел", "жена", "мъж", "дете", "брат", "сестра", "баба", "дядо",
    "син", "дъщеря", "чичо", "леля", "братовчед", "съпруг", "съпруга", "роднина",
  ],
  "Food & drink": [
    "вода", "кафе", "чай", "хляб", "мляко", "сирене", "месо", "ябълка", "супа", "салата",
    "зеленчук", "плод", "риба", "пиле", "ориз", "картофи", "домат", "краставица", "бира",
    "вино", "сол", "захар", "масло", "яйце", "банан",
  ],
  "Shopping & money": [
    "лев", "скъпо", "евтино", "пари", "искам", "стотинка", "магазин", "пазар", "каса",
    "продавач", "сметка",
  ],
  "Numbers & time": [
    "час", "ден", "седмица", "днес", "утре", "вчера", "сега", "минута", "месец", "година",
    "сутрин", "обед", "следобед", "вечер", "полунощ", "рано", "късно",
  ],
  "Days & months": [
    "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота", "неделя",
    "януари", "февруари", "март", "април", "май", "юни",
    "юли", "август", "септември", "октомври", "ноември", "декември",
    "сезон", "пролет", "лято", "есен", "зима",
  ],
  "City & directions": [
    "улица", "площад", "ляво", "дясно", "направо", "тук", "там", "къде", "автобус",
    "трамвай", "метро", "спирка", "гара", "летище", "център", "квартал", "адрес", "карта",
    "близо", "далеч",
  ],
  "Common verbs": [
    "съм", "имам", "искам", "мога", "трябва", "говоря", "разбирам", "знам",
    "отивам", "правя", "ям", "пия", "живея", "работя", "обичам",
    "виждам", "чувам", "чета", "пиша", "купувам", "продавам", "плащам", "чакам", "идвам",
    "тръгвам", "спя", "ставам", "харесвам", "помагам", "търся", "намирам", "давам", "вземам", "играя",
  ],
  "Common adjectives": [
    "голям", "малък", "добър", "лош", "хубав", "нов", "стар", "топъл", "студен",
    "бърз", "бавен", "лесен", "труден", "скъп", "евтин", "весел", "тъжен", "уморен",
    "гладен", "жаден", "зает", "свободен", "чист", "мръсен",
  ],
  "Question words": ["кой", "какво", "къде", "кога", "защо", "как", "колко"],
  "Emergencies & health": [
    "помощ", "боли", "лекар", "аптека", "болница", "треска", "простуда", "глава", "стомах",
    "зъб", "спешно", "полиция", "пожар", "катастрофа", "лекарство",
  ],
};

export const DOMAIN_PHRASES: Record<string, { bg: string; en: string }[]> = {
  "Greetings & politeness": [
    { bg: "добър ден", en: "good day" },
    { bg: "добро утро", en: "good morning" },
    { bg: "добър вечер", en: "good evening" },
    { bg: "лека нощ", en: "good night" },
    { bg: "как си", en: "how are you (informal)" },
    { bg: "как сте", en: "how are you (formal)" },
    { bg: "приятно ми е", en: "nice to meet you" },
    { bg: "много благодаря", en: "thank you very much" },
    { bg: "няма защо", en: "you're welcome, no problem" },
  ],
  "About me": [
    { bg: "казвам се", en: "my name is / I am called" },
    { bg: "откъде си", en: "where are you from (informal)" },
  ],
  "Shopping & money": [
    { bg: "колко струва", en: "how much does it cost" },
    { bg: "имате ли", en: "do you have" },
    { bg: "може ли да платя с карта", en: "can I pay by card" },
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
