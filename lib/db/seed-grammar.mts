import "dotenv/config";
import { db } from "./index";
import { grammarTopics, grammarDrills } from "./schema";

type DrillSeed = {
  promptBg: string;
  promptEn: string;
  correctAnswer: string;
  options: string[];
};

type TopicSeed = {
  title: string;
  description: string;
  notes: string;
  level: "A1" | "A2" | "B1" | "B2";
  drills: DrillSeed[];
};

const TOPICS: TopicSeed[] = [
  // ---------- A1 ----------
  {
    title: "\"To be\" (съм)",
    description: "аз съм, ти си, той/тя/то е, ние сме, вие сте, те са",
    notes:
      "Съм is Bulgarian's only truly irregular verb and its most common one -- every person has its own unique form, unlike regular verbs that share endings across a conjugation class. Unlike English, Bulgarian happily drops the subject pronoun (\"студент съм\" works fine without \"аз\"), since the verb ending already signals who's speaking. Negation just adds не before it (не съм, not \"съм не\"), and questions add ли right after it, not a helper verb at the front like English \"is he...?\".",
    level: "A1",
    drills: [
      { promptBg: "Аз ___ студент.", promptEn: "I am a student.", correctAnswer: "съм", options: ["съм", "си", "е", "сме"] },
      { promptBg: "Ти ___ добре.", promptEn: "You are well.", correctAnswer: "си", options: ["си", "съм", "е", "сте"] },
      { promptBg: "Той ___ лекар.", promptEn: "He is a doctor.", correctAnswer: "е", options: ["е", "съм", "си", "са"] },
      { promptBg: "Ние ___ приятели.", promptEn: "We are friends.", correctAnswer: "сме", options: ["сме", "сте", "са", "съм"] },
      { promptBg: "Вие ___ учители.", promptEn: "You (all) are teachers.", correctAnswer: "сте", options: ["сте", "сме", "са", "е"] },
      { promptBg: "Те ___ студенти.", promptEn: "They are students.", correctAnswer: "са", options: ["са", "е", "си", "сме"] },
    ],
  },
  {
    title: "Present tense verb endings",
    description: "-ам/-я/-и verb families",
    notes:
      "Bulgarian verbs fall into three conjugation families based on their 1st-person-singular ending: -а/-я verbs (чета → чета, четеш, чете...), -и verbs (говоря → говоря, говориш, говори...), and a smaller -е class. Once you know a verb's family, the rest of its present-tense endings are fully predictable -- there's no irregular \"do/does\" pattern to memorize like in English. The tricky part for beginners is usually stress: it can shift between forms (говоря vs говорим), and getting it wrong doesn't block understanding but does mark you as a learner.",
    level: "A1",
    drills: [
      { promptBg: "Тя ___ книга.", promptEn: "She reads a book.", correctAnswer: "чете", options: ["чете", "чета", "четеш", "четат"] },
      { promptBg: "Ние ___ вкъщи.", promptEn: "We work at home.", correctAnswer: "работим", options: ["работим", "работя", "работиш", "работят"] },
      { promptBg: "Той ___ бързо.", promptEn: "He speaks quickly.", correctAnswer: "говори", options: ["говори", "говоря", "говориш", "говорят"] },
      { promptBg: "Вие ___ ли английски?", promptEn: "Do you speak English?", correctAnswer: "говорите", options: ["говорите", "говоря", "говори", "говорят"] },
    ],
  },
  {
    title: "Negation",
    description: "не before the verb",
    notes:
      "Negation is simpler than English's: just put не directly in front of the verb, with no auxiliary \"do/does\" needed (English \"I don't understand\" vs Bulgarian \"не разбирам\" -- literally \"not I-understand\"). One place English speakers trip up is double negation: where English treats \"I don't want nothing\" as wrong, Bulgarian requires it -- \"Не искам нищо\" (not I-want nothing) is the only correct way to say \"I don't want anything\".",
    level: "A1",
    drills: [
      { promptBg: "Аз ___ разбирам.", promptEn: "I don't understand.", correctAnswer: "не", options: ["не", "ли", "и", "но"] },
      { promptBg: "Той ___ е тук.", promptEn: "He is not here.", correctAnswer: "не", options: ["не", "ли", "и", "да"] },
      { promptBg: "___ искам кафе.", promptEn: "I don't want coffee.", correctAnswer: "Не", options: ["Не", "Да", "Ли", "И"] },
    ],
  },
  {
    title: "Yes/no questions (ли)",
    description: "verb + ли",
    notes:
      "Bulgarian turns a statement into a yes/no question by inserting the tiny particle ли directly after the word being questioned -- almost always the verb, right at the start of the sentence (Говориш ли английски? -- \"Do you speak English?\"). There's no word-order inversion and no \"do/does\" support like in English; the statement's word order stays intact, ли is the only signal. Because ли is an enclitic (it leans on the word before it and is never stressed itself), it can also shift to question a different word specifically, e.g. putting it after \"английски\" instead would ask specifically about English rather than about speaking in general.",
    level: "A1",
    drills: [
      { promptBg: "Говориш ___ английски?", promptEn: "Do you speak English?", correctAnswer: "ли", options: ["ли", "не", "и", "но"] },
      { promptBg: "Искаш ___ кафе?", promptEn: "Do you want coffee?", correctAnswer: "ли", options: ["ли", "не", "да", "и"] },
      { promptBg: "Разбираш ___?", promptEn: "Do you understand?", correctAnswer: "ли", options: ["ли", "не", "да", "и"] },
    ],
  },
  {
    title: "Definite article",
    description: "the -та/-то/-ът/-те tail",
    notes:
      "Bulgarian is one of the few Slavic languages to have a definite article at all -- most of its relatives (Russian, Polish, Czech) have none. Rather than a separate word like English \"the\", it's a suffix glued onto the end of the noun itself, and which suffix depends on the noun's gender: -та for feminine (книга → книгата), -то for neuter (дете → детето), -ът/-я for masculine (мъж → мъжът), and -те for all plurals. Masculine nouns additionally distinguish a subject form (-ът) from an object form (-а) in careful/formal writing, though spoken Bulgarian often blurs this distinction.",
    level: "A1",
    drills: [
      { promptBg: "___ е на масата.", promptEn: "The book is on the table.", correctAnswer: "Книгата", options: ["Книгата", "Книга", "Книги", "Книгите"] },
      { promptBg: "___ е висока.", promptEn: "The house is tall.", correctAnswer: "Къщата", options: ["Къщата", "Къща", "Къщи", "Къщите"] },
      { promptBg: "___ е добър.", promptEn: "The man is good.", correctAnswer: "Мъжът", options: ["Мъжът", "Мъж", "Мъже", "Мъжете"] },
    ],
  },
  {
    title: "Plurals",
    description: "one word, many words",
    notes:
      "Plural formation depends heavily on gender and the noun's ending, so there's no single \"add -s\" rule like English. Feminine nouns ending in -а/-я usually swap it for -и (книга → книги). Masculine nouns typically add -и too (студент → студенти), but short monosyllabic masculine nouns often take a special counting form ending in -а used only after numbers 2-10 (два часа, not два часове). Neuter nouns are the least predictable, splitting between -а (дете → деца) and -та/-ета (яйце → яйца, but куче → кучета) depending on the singular ending.",
    level: "A1",
    drills: [
      { promptBg: "Имам две ___.", promptEn: "I have two books.", correctAnswer: "книги", options: ["книги", "книга", "книгата", "книгите"] },
      { promptBg: "Тук има много ___.", promptEn: "There are many dogs here.", correctAnswer: "кучета", options: ["кучета", "куче", "кучето", "кучетата"] },
      { promptBg: "Децата имат ___.", promptEn: "The children have apples.", correctAnswer: "ябълки", options: ["ябълки", "ябълка", "ябълката", "ябълките"] },
    ],
  },
  {
    title: "Question words",
    description: "кой, какво, къде, кога, защо, как, колко",
    notes:
      "Most of these behave exactly like their English counterparts, but кой (\"who/which\") is unusual in actually agreeing in gender and number with what it's asking about -- коя книга (which book, feminine), кое дете (which child, neuter), кои хора (which people, plural). Как is doing double duty worth noticing: besides \"how\" (Как си? -- \"How are you?\"), it's the standard way to ask someone's name (Как се казваш? -- literally \"How do you call yourself?\"), which trips up learners expecting a \"what\" question there.",
    level: "A1",
    drills: [
      { promptBg: "___ е той?", promptEn: "Who is he?", correctAnswer: "Кой", options: ["Кой", "Какво", "Къде", "Кога"] },
      { promptBg: "___ правиш?", promptEn: "What are you doing?", correctAnswer: "Какво", options: ["Какво", "Кой", "Как", "Защо"] },
      { promptBg: "___ живееш?", promptEn: "Where do you live?", correctAnswer: "Къде", options: ["Къде", "Кога", "Как", "Колко"] },
      { promptBg: "___ е часът?", promptEn: "What time is it?", correctAnswer: "Колко", options: ["Колко", "Какво", "Кой", "Как"] },
      { promptBg: "___ учиш български?", promptEn: "Why are you learning Bulgarian?", correctAnswer: "Защо", options: ["Защо", "Как", "Кога", "Кой"] },
      { promptBg: "___ се казваш?", promptEn: "What's your name?", correctAnswer: "Как", options: ["Как", "Какво", "Кой", "Къде"] },
    ],
  },
  {
    title: "Adjectives and agreement",
    description: "голям/голяма/голямо/големи, добър/добра/добро/добри, хубав/хубава/хубаво/хубави",
    notes:
      "Every adjective has four forms and must agree with the noun it describes: masculine, feminine (-а), neuter (-о), and plural (-и), regardless of the noun's own gender-marking suffix. This is stricter than English (which has no adjective agreement at all) but more forgiving than languages with full case systems, since Bulgarian adjectives don't also change for grammatical case. The masculine form is the trickiest to guess from the dictionary entry, since it can end in a consonant (добър), -и (хубав → but this one's regular), or drop a vowel in the stem entirely (as добър does: masc. добър but fem. добра, losing the -ъ-).",
    level: "A1",
    drills: [
      { promptBg: "Това е ___ къща.", promptEn: "This is a big house.", correctAnswer: "голяма", options: ["голяма", "голям", "голямо", "големи"] },
      { promptBg: "Той е ___ мъж.", promptEn: "He is a good man.", correctAnswer: "добър", options: ["добър", "добра", "добро", "добри"] },
      { promptBg: "Тя е ___ жена.", promptEn: "She is a beautiful woman.", correctAnswer: "хубава", options: ["хубава", "хубав", "хубаво", "хубави"] },
      { promptBg: "Детето е ___.", promptEn: "The child is big.", correctAnswer: "голямо", options: ["голямо", "голям", "голяма", "големи"] },
      { promptBg: "Те са ___ приятели.", promptEn: "They are good friends.", correctAnswer: "добри", options: ["добри", "добър", "добра", "добро"] },
    ],
  },
  {
    title: "This / that",
    description: "този (m), тази (f), това (n), тези (pl)",
    notes:
      "Like adjectives, demonstratives agree in gender and number with their noun: този мъж, тази жена, това дете, тези хора. Bulgarian also keeps a separate, less common \"that (over there)\" set -- онзи/онази/онова/онези -- for things genuinely distant from the speaker, a distinction English collapsed into just \"this\" vs \"that\" long ago. In casual speech, тоя/тая/тва are common contracted alternatives to този/тази/това that you'll hear constantly but shouldn't write in anything formal.",
    level: "A1",
    drills: [
      { promptBg: "___ книга е моя.", promptEn: "This book is mine.", correctAnswer: "Тази", options: ["Тази", "Този", "Това", "Тези"] },
      { promptBg: "___ мъж е учител.", promptEn: "This man is a teacher.", correctAnswer: "Този", options: ["Този", "Тази", "Това", "Тези"] },
      { promptBg: "___ дете е мило.", promptEn: "This child is cute.", correctAnswer: "Това", options: ["Това", "Този", "Тази", "Тези"] },
      { promptBg: "___ хора са мили.", promptEn: "These people are nice.", correctAnswer: "Тези", options: ["Тези", "Този", "Тази", "Това"] },
    ],
  },
  {
    title: "Possession",
    description: "ми, ти, му, ѝ, ни, ви, им",
    notes:
      "Rather than a possessive word before the noun (English \"my house\"), Bulgarian usually attaches a short pronoun right after the (definite) noun: къщата ми -- literally \"the-house to-me\". These short forms are technically dative pronouns doing possession duty, which is why they look like indirect-object pronouns elsewhere in the grammar. Bulgarian does also have full possessive adjectives (мой, твой, негов, неин...) that agree in gender like other adjectives, but they're reserved for emphasis or formal writing -- the short enclitic forms are what you'll actually hear in everyday speech.",
    level: "A1",
    drills: [
      { promptBg: "Кафето ___ е студено.", promptEn: "My coffee is cold.", correctAnswer: "ми", options: ["ми", "ти", "му", "ни"] },
      { promptBg: "Къщата ___ е голяма.", promptEn: "Your house is big.", correctAnswer: "ти", options: ["ти", "ми", "му", "ѝ"] },
      { promptBg: "Приятелят ___ живее в София.", promptEn: "His friend lives in Sofia.", correctAnswer: "му", options: ["му", "ѝ", "ми", "им"] },
      { promptBg: "Майка ___ е лекар.", promptEn: "Her mother is a doctor.", correctAnswer: "ѝ", options: ["ѝ", "му", "ми", "ви"] },
      { promptBg: "Домът ___ е близо.", promptEn: "Our home is close.", correctAnswer: "ни", options: ["ни", "ви", "им", "му"] },
    ],
  },
  {
    title: "Prepositions",
    description: "в, на, от, до, с, за",
    notes:
      "The single biggest headache here for English speakers is that в and на both cover ground that English splits between \"in\", \"at\", and \"on\": в софия (in Sofia) but на масата (on the table) and на работа (at work) -- there's no reliable rule, just usage that has to be learned noun by noun. Bulgarian also has no separate word for possession's \"of\" -- на does that job too (къщата на Иван, \"Ivan's house\", literally \"the house of Ivan\") since Bulgarian lost the genitive case that other Slavic languages use for this instead.",
    level: "A1",
    drills: [
      { promptBg: "Живея ___ София.", promptEn: "I live in Sofia.", correctAnswer: "в", options: ["в", "на", "от", "с"] },
      { promptBg: "Книгата е ___ масата.", promptEn: "The book is on the table.", correctAnswer: "на", options: ["на", "в", "от", "до"] },
      { promptBg: "Аз съм ___ Турция.", promptEn: "I am from Turkey.", correctAnswer: "от", options: ["от", "в", "на", "за"] },
      { promptBg: "Магазинът е ___ хотела.", promptEn: "The store is next to the hotel.", correctAnswer: "до", options: ["до", "на", "в", "от"] },
      { promptBg: "Говоря ___ приятеля си.", promptEn: "I'm talking with my friend.", correctAnswer: "с", options: ["с", "за", "от", "на"] },
      { promptBg: "Това е подарък ___ теб.", promptEn: "This is a gift for you.", correctAnswer: "за", options: ["за", "с", "до", "от"] },
    ],
  },
  {
    title: "Modal verbs",
    description: "мога (can), трябва (must), искам да (want to)",
    notes:
      "Bulgarian lost the infinitive form entirely (unlike most other European languages, including its Slavic relatives), so there's no equivalent of English \"to speak\" as a bare verb form to plug after a modal. Instead, every modal construction uses да + a present-tense verb conjugated for the actual subject: искам да говоря (\"I want that-I speak\"), literally a subordinate clause standing in for what English does with an infinitive. Трябва is also unusual in staying the same for every person (трябва да отида, трябва да отидеш, трябва да отиде...) -- only the verb after да changes, not трябва itself.",
    level: "A1",
    drills: [
      { promptBg: "___ да говоря малко български.", promptEn: "I can speak a little Bulgarian.", correctAnswer: "Мога", options: ["Мога", "Трябва", "Искам", "Обичам"] },
      { promptBg: "___ да отида на лекар.", promptEn: "I need to go to the doctor.", correctAnswer: "Трябва", options: ["Трябва", "Мога", "Искам", "Знам"] },
      { promptBg: "___ да науча български.", promptEn: "I want to learn Bulgarian.", correctAnswer: "Искам", options: ["Искам", "Мога", "Трябва", "Обичам"] },
    ],
  },
  {
    title: "\"I like\"",
    description: "харесва ми / обичам",
    notes:
      "Харесва ми works like Spanish \"me gusta\" or French \"ça me plaît\": the thing liked is the grammatical subject, and the person doing the liking appears as a dative pronoun (Харесва ми София -- literally \"Sofia pleases to-me\"). This flips the sentence structure English speakers expect, where \"I\" is the subject. Обичам is more straightforward -- a normal transitive verb (\"I love/like X\") -- but it's stronger than харесва ми and gets used for both people you love and things you genuinely love (обичам кафе), so context decides whether it reads as \"love\" or just \"really like\".",
    level: "A1",
    drills: [
      { promptBg: "Харесва ___ София.", promptEn: "I like Sofia.", correctAnswer: "ми", options: ["ми", "ти", "му", "ни"] },
      { promptBg: "___ кафе всяка сутрин.", promptEn: "I love coffee every morning.", correctAnswer: "Обичам", options: ["Обичам", "Харесвам", "Искам", "Мога"] },
      { promptBg: "___ тази книга.", promptEn: "I like this book.", correctAnswer: "Харесвам", options: ["Харесвам", "Обичам", "Искам", "Мога"] },
    ],
  },
  {
    title: "Future tense",
    description: "ще + verb",
    notes:
      "Ще is an invariant particle -- it never conjugates, no matter the subject (ще говоря, ще говориш, ще говори all use the same ще). It started historically as the verb \"to want\" and grammaticalized into a pure future marker, similar to how English \"will\" originally meant \"to want\" too. The negative future isn't не ще but a separate word entirely, няма да + present tense (няма да дойда -- \"I won't come\"), which is worth memorizing as its own fixed pattern rather than trying to derive it from ще's negation.",
    level: "A1",
    drills: [
      { promptBg: "Утре ___ работя.", promptEn: "Tomorrow I will work.", correctAnswer: "ще", options: ["ще", "не", "ли", "е"] },
      { promptBg: "___ говоря с теб утре.", promptEn: "I will speak with you tomorrow.", correctAnswer: "Ще", options: ["Ще", "Съм", "Беше", "Да"] },
      { promptBg: "Тя ___ дойде довечера.", promptEn: "She will come tonight.", correctAnswer: "ще", options: ["ще", "е", "беше", "да"] },
    ],
  },
  {
    title: "Past tense (basic)",
    description: "бях (I was), ядох, казах, отидох",
    notes:
      "This introduces the aorist, Bulgarian's default tense for narrating a single completed past event -- the one you'll use constantly telling someone what you did yesterday. It's a separate topic from the aorist-vs-imperfect distinction covered later (A2), which is about choosing between two different past tenses; here the goal is just recognizing and forming the aorist itself. Note that Bulgarian's aorist endings vary more by verb than the present tense's do, so these common irregular-looking forms (бях, ядох, казах) are worth memorizing individually before tackling the fuller pattern.",
    level: "A1",
    drills: [
      { promptBg: "___ в България миналата година.", promptEn: "I was in Bulgaria last year.", correctAnswer: "Бях", options: ["Бях", "Съм", "Ще съм", "Бъда"] },
      { promptBg: "Вчера ___ хляб и сирене.", promptEn: "Yesterday I ate bread and cheese.", correctAnswer: "ядох", options: ["ядох", "ям", "ще ям", "яде"] },
      { promptBg: "___ здравей на съседа.", promptEn: "I said hello to the neighbor.", correctAnswer: "Казах", options: ["Казах", "Казвам", "Ще кажа", "Кажи"] },
      { promptBg: "Вчера ___ на пазара.", promptEn: "Yesterday I went to the market.", correctAnswer: "отидох", options: ["отидох", "отивам", "ще отида", "отиде"] },
    ],
  },
  {
    title: "Imperative (basic)",
    description: "дай, кажи, извинете",
    notes:
      "The imperative has just two real forms per verb: one for ти (informal singular, дай) and one shared by вие -- both the plural \"you all\" and the formal singular \"you\" (дайте), the same politeness distinction French makes with tu/vous. Извинете is worth learning as a fixed phrase before the pattern behind it makes sense: it's literally the formal/plural imperative of извинявам (\"to excuse\"), used by default even toward one stranger, since starting a request with the informal Извини would feel oddly familiar.",
    level: "A1",
    drills: [
      { promptBg: "___ ми молив, моля.", promptEn: "Give me a pencil, please.", correctAnswer: "Дай", options: ["Дай", "Дайте", "Кажи", "Вземи"] },
      { promptBg: "___ ми истината.", promptEn: "Tell me the truth.", correctAnswer: "Кажи", options: ["Кажи", "Дай", "Кажете", "Вземи"] },
      { promptBg: "___, не разбирам.", promptEn: "Excuse me, I don't understand.", correctAnswer: "Извинете", options: ["Извинете", "Извини", "Моля", "Благодаря"] },
    ],
  },
  {
    title: "Connecting sentences",
    description: "и, но, защото, затова",
    notes:
      "These four cover most everyday sentence-linking: и (\"and\"), но (\"but\"), защото (\"because\", introducing the reason), and затова (\"so/that's why\", introducing the result) -- notice защото and затова are near-mirror images of each other, one pointing backward to a cause and the other forward to a consequence, which makes them easy to mix up at first. Unlike English \"because\", защото can't start a sentence on its own as a sentence fragment answer to \"why\" in formal writing, though it's completely normal in speech (Защо? Защото.).",
    level: "A1",
    drills: [
      { promptBg: "Обичам кафе, ___ не обичам чай.", promptEn: "I love coffee but I don't love tea.", correctAnswer: "но", options: ["но", "и", "защото", "затова"] },
      { promptBg: "Гладен съм ___ уморен.", promptEn: "I'm hungry and tired.", correctAnswer: "и", options: ["и", "но", "защото", "затова"] },
      { promptBg: "Не отидох, ___ валеше.", promptEn: "I didn't go because it was raining.", correctAnswer: "защото", options: ["защото", "затова", "и", "но"] },
      { promptBg: "Валеше, ___ не отидох.", promptEn: "It was raining, so I didn't go.", correctAnswer: "затова", options: ["затова", "защото", "и", "но"] },
    ],
  },

  // ---------- A2 ----------
  {
    title: "Aorist vs imperfect",
    description: "completed past action vs ongoing/habitual past",
    notes:
      "Where English uses one simple past for everything (\"I read\", \"I lived\"), Bulgarian forces a choice between two past tenses every time: aorist for a single, completed, bounded event (четох -- \"I read [and finished]\"), and imperfect for something ongoing, repeated, or habitual in the past (четях -- \"I was reading\" / \"I used to read\"). This is a genuinely different way of carving up time than English grammar does, so the useful mental test isn't tense-translation but asking \"was this one finished action, or a state/habit/backdrop?\" This distinction is separate from verbal aspect (covered at B1) -- aspect is a property of the verb itself, while this is about which past tense you conjugate it into.",
    level: "A2",
    drills: [
      { promptBg: "Вчера ___ книга цял ден.", promptEn: "Yesterday I was reading a book all day.", correctAnswer: "четях", options: ["четях", "четох", "чета", "ще чета"] },
      { promptBg: "Вчера ___ книгата.", promptEn: "Yesterday I finished reading the book.", correctAnswer: "четох", options: ["четох", "четях", "чета", "ще чета"] },
      { promptBg: "Като дете ___ във Варна.", promptEn: "As a child I lived (used to live) in Varna.", correctAnswer: "живеех", options: ["живеех", "живях", "живея", "ще живея"] },
    ],
  },
  {
    title: "Comparison of adjectives",
    description: "по- (more), най- (most)",
    notes:
      "Bulgarian builds comparatives and superlatives with prefixes rather than English's mix of -er/-est suffixes and separate \"more/most\": по- attaches to any adjective for \"more\" (голям → по-голям, \"bigger\") and най- for \"most\" (най-голям, \"biggest\") -- no irregular forms to memorize like English \"good/better/best\". Because it's a prefix rather than a separate word, по- and най- attach directly onto the adjective and still fully agree in gender with the noun (по-голяма къща, feminine), so agreement rules from basic adjectives still apply on top of the comparison.",
    level: "A2",
    drills: [
      { promptBg: "Този дом е ___ от онзи.", promptEn: "This house is bigger than that one.", correctAnswer: "по-голям", options: ["по-голям", "голям", "най-голям", "голяма"] },
      { promptBg: "Тя е ___ ученичка в класа.", promptEn: "She is the best student in the class.", correctAnswer: "най-добрата", options: ["най-добрата", "добра", "по-добра", "добрата"] },
      { promptBg: "Днес е ___ от вчера.", promptEn: "Today is colder than yesterday.", correctAnswer: "по-студено", options: ["по-студено", "студено", "най-студено", "по-топло"] },
    ],
  },
  {
    title: "Ordinal numbers",
    description: "първи, втори, трети...",
    notes:
      "Ordinals behave as regular adjectives and agree in gender/number like any other: първи (masc.), първа (fem.), първо (neut.), първи (plural, coincidentally identical to masculine singular here). Първи (\"first\") is irregular and unrelated to the cardinal number едно, similar to how English \"first\" doesn't derive from \"one\" -- but from второ (\"second\") onward, most ordinals are built predictably from the cardinal number plus an adjective ending (три → трети).",
    level: "A2",
    drills: [
      { promptBg: "Той живее на ___ етаж.", promptEn: "He lives on the second floor.", correctAnswer: "втория", options: ["втория", "втори", "две", "второ"] },
      { promptBg: "Утре е ___ май.", promptEn: "Tomorrow is the first of May.", correctAnswer: "първи", options: ["първи", "едно", "първо", "първа"] },
      { promptBg: "Тя финишира ___.", promptEn: "She finished third.", correctAnswer: "трета", options: ["трета", "три", "трети", "третото"] },
    ],
  },
  {
    title: "Reflexive verbs",
    description: "се-verbs",
    notes:
      "Се marks that the subject and object of the verb are the same person -- \"washes himself\", \"see each other\" -- and sits in a fixed slot early in the sentence (right after the verb, or before it if something else like не comes first) rather than after the verb the way English \"-self\" pronouns do. Some verbs are only ever used with се and don't really have a non-reflexive meaning at all (казвам се -- \"to be called/named\" -- doesn't mean anything as bare казвам in that sense), so these are worth learning as fixed units rather than deriving се's meaning fresh each time.",
    level: "A2",
    drills: [
      { promptBg: "Аз ___ казвам Иван.", promptEn: "My name is Ivan.", correctAnswer: "се", options: ["се", "си", "го", "ги"] },
      { promptBg: "Той ___ мие сутрин.", promptEn: "He washes himself in the morning.", correctAnswer: "се", options: ["се", "си", "му", "го"] },
      { promptBg: "Ние ___ виждаме утре.", promptEn: "We'll see each other tomorrow.", correctAnswer: "се", options: ["се", "си", "ни", "ги"] },
    ],
  },
  {
    title: "Long vs short object pronouns",
    description: "го vs него, ме vs мен -- short forms in normal position, long forms for emphasis or after prepositions",
    notes:
      "Bulgarian object pronouns come in two versions: short, unstressed clitic forms (го, ме, му, ми...) used in ordinary sentences, and long, stressed forms (него, мен, на него, на мен...) reserved for after a preposition, for standalone emphasis, or when the pronoun starts the sentence. This is a genuine doubling system, not just style -- за мен (\"for me\") requires the long form after a preposition, while an ordinary statement (\"I see him\") requires the short form (Виждам го), and mixing them up is a very recognizable non-native mistake.",
    level: "A2",
    drills: [
      { promptBg: "Виждам ___.", promptEn: "I see him.", correctAnswer: "го", options: ["го", "него", "му", "си"] },
      { promptBg: "Това е за ___.", promptEn: "This is for me.", correctAnswer: "мен", options: ["мен", "ме", "си", "ми"] },
      { promptBg: "___ обичам, а не него.", promptEn: "I love YOU, not him.", correctAnswer: "Тебе", options: ["Тебе", "Те", "Ти", "Му"] },
    ],
  },
  {
    title: "\"Има / няма\"",
    description: "there is / there isn't",
    notes:
      "Има and няма are invariant across every person and number in the present tense -- unlike English, which conjugates \"to be\" (\"there is\" vs \"there are\"), Bulgarian just uses има or няма regardless of what follows. The related verb имам (\"to have\", for ordinary possession -- имам, имаш, има...) does fully conjugate, so it's worth keeping the two uses distinct: имам мляко is \"I have milk\", while Има мляко is the existential \"There is milk\", sharing a root but working differently in the sentence.",
    level: "A2",
    drills: [
      { promptBg: "___ мляко в хладилника.", promptEn: "There is milk in the fridge.", correctAnswer: "Има", options: ["Има", "Няма", "Е", "Са"] },
      { promptBg: "___ никой вкъщи.", promptEn: "There's nobody home.", correctAnswer: "Няма", options: ["Няма", "Има", "Не", "Да"] },
      { promptBg: "___ ли въпроси?", promptEn: "Are there any questions?", correctAnswer: "Има", options: ["Има", "Няма", "Е", "Ли"] },
    ],
  },
  {
    title: "Adverbs",
    description: "formed from adjectives, usually the neuter form",
    notes:
      "Most Bulgarian adverbs are simply the adjective's neuter singular form used on its own -- бавен (\"slow\", masc.) becomes бавно (\"slowly\") by reaching for the same -о ending already used for neuter agreement, rather than adding a distinct suffix the way English adds -ly. This means once you know an adjective's four gender forms, you already know its adverb for free: no separate vocabulary to learn. A handful of high-frequency adverbs are irregular or unrelated to any adjective (добре -- \"well\" -- rather than a form of добър), and those are worth memorizing individually.",
    level: "A2",
    drills: [
      { promptBg: "Той говори ___.", promptEn: "He speaks slowly.", correctAnswer: "бавно", options: ["бавно", "бавен", "бавна", "бавни"] },
      { promptBg: "Тя пее ___.", promptEn: "She sings beautifully.", correctAnswer: "хубаво", options: ["хубаво", "хубав", "хубава", "хубави"] },
      { promptBg: "Работим ___ заедно.", promptEn: "We work well together.", correctAnswer: "добре", options: ["добре", "добър", "добра", "добро"] },
    ],
  },
  {
    title: "\"Ако\" (if) clauses",
    description: "real/likely conditions",
    notes:
      "Ако clauses cover \"real\" conditionals -- things that genuinely could happen (Ако вали, ще остана вкъщи -- \"If it rains, I'll stay home\") -- and pattern closely with English if-clauses: condition first, ще-future in the result. This is a separate, simpler system from the conditional mood covered at B1 (бих, би...), which handles hypothetical or contrary-to-fact situations (\"if I had...\", \"I would...\"); mixing the two up is a common learner error, since English \"if\" covers both cases with the same word while Bulgarian expects ако + present tense here and a different construction for the unreal cases.",
    level: "A2",
    drills: [
      { promptBg: "___ вали, ще остана вкъщи.", promptEn: "If it rains, I'll stay home.", correctAnswer: "Ако", options: ["Ако", "Че", "Когато", "Затова"] },
      { promptBg: "___ имам пари, ще купя кола.", promptEn: "If I have money, I'll buy a car.", correctAnswer: "Ако", options: ["Ако", "Но", "И", "Защото"] },
    ],
  },
  {
    title: "Prepositions of time",
    description: "след, преди, през",
    notes:
      "След (\"after/in [duration]\") and преди (\"before/[duration] ago\") are mirror images of each other on the timeline, both usable for a specific point (преди обяд -- \"before noon\") or a duration counting forward/back from now (след два часа -- \"in two hours\"). През is the odd one out, meaning \"during/throughout\" a period rather than marking a boundary -- през 1990 година (\"in 1990\"), през лятото (\"during the summer\") -- and is the one English speakers most often skip in favor of на or в out of habit from English \"in [year]\".",
    level: "A2",
    drills: [
      { promptBg: "Ще се видим ___ два часа.", promptEn: "We'll meet in two hours.", correctAnswer: "след", options: ["след", "преди", "по", "на"] },
      { promptBg: "Роден съм ___ 1990 година.", promptEn: "I was born in 1990.", correctAnswer: "през", options: ["през", "на", "в", "от"] },
      { promptBg: "Пристигнах ___ обяд.", promptEn: "I arrived before noon.", correctAnswer: "преди", options: ["преди", "след", "през", "на"] },
    ],
  },

  // ---------- B1 ----------
  {
    title: "Verbal aspect (intro)",
    description: "imperfective (ongoing/habitual) vs perfective (completed) verbs",
    notes:
      "Most Bulgarian verbs come in pairs sharing a root but differing in aspect: an imperfective form for ongoing/repeated/general action (чета -- \"I read/am reading\") and a perfective form for a single completed action, very often built by adding a prefix (про-, на-, за-...) to the imperfective (прочета -- \"I will read [to completion]\"). This is a property of the verb itself, independent of tense -- an imperfective verb can be past, present, or future, and so can its perfective partner -- which is what makes it distinct from (and more fundamental than) the aorist-vs-imperfect past-tense choice covered at A2. English has nothing directly equivalent; the closest intuition is the difference between \"I was writing a letter\" (process) and \"I wrote the letter\" (completed result), but Bulgarian marks that distinction on the verb itself in every tense, not just the past.",
    level: "B1",
    drills: [
      { promptBg: "Всеки ден ___ вестника.", promptEn: "Every day I read the newspaper.", correctAnswer: "чета", options: ["чета", "прочета", "четох", "прочетох"] },
      { promptBg: "Вчера ___ книгата за един час.", promptEn: "Yesterday I read (finished) the book in one hour.", correctAnswer: "прочетох", options: ["прочетох", "четох", "чета", "прочета"] },
      { promptBg: "Той обича да ___ писма.", promptEn: "He likes writing letters.", correctAnswer: "пише", options: ["пише", "напише", "писа", "написа"] },
      { promptBg: "Тя ще ___ писмото до утре.", promptEn: "She will finish writing the letter by tomorrow.", correctAnswer: "напише", options: ["напише", "пише", "написа", "писа"] },
    ],
  },
  {
    title: "Conditional mood",
    description: "бих, би, бихме (would)",
    notes:
      "The conditional is built from a special short form of \"to be\" (бих, би, бихме...) historically derived from an old aorist, plus the l-participle -- the same participle form used in perfect and renarrated constructions, so recognizing it here pays off elsewhere. Beyond textbook hypotheticals (\"if I had more time, I would study more\"), бих is also the standard polite way to soften a request or offer, similar to English \"would\" in \"Would you like...\" -- Бих искал кафе reads as noticeably more polite than the blunt Искам кафе.",
    level: "B1",
    drills: [
      { promptBg: "___ искал да пътувам повече.", promptEn: "I would like to travel more.", correctAnswer: "Бих", options: ["Бих", "Ще", "Може", "Съм"] },
      { promptBg: "Ако имах повече време, ___ учил повече.", promptEn: "If I had more time, I would study more.", correctAnswer: "бих", options: ["бих", "ще", "бях", "съм"] },
      { promptBg: "Тя ___ помогнала, ако можеше.", promptEn: "She would have helped if she could.", correctAnswer: "би", options: ["би", "ще", "беше", "е"] },
    ],
  },
  {
    title: "Renarrated mood (intro)",
    description: "marking that you're reporting something secondhand, not witnessed directly -- a distinctive Bulgarian feature",
    notes:
      "This is one of the genuinely unusual features of Bulgarian grammar, with no real equivalent in English: verb forms built on the l-participle (бил, била, било...) signal that the speaker didn't witness the event directly but is reporting it secondhand, inferring it from evidence, or expressing mild doubt about it -- an evidentiality system, grammatically marking the source of your information the way English would only do with extra words like \"apparently\" or \"I heard that...\". It shows up constantly in storytelling, folk tales, gossip, and news reporting (Той бил много добър студент -- \"He was, so I'm told, a very good student\"), and switching into it mid-conversation can subtly signal skepticism about what's being reported.",
    level: "B1",
    drills: [
      { promptBg: "Той ___ много добър студент, така ми казаха.", promptEn: "He was, I was told, a very good student.", correctAnswer: "бил", options: ["бил", "е", "беше", "бъде"] },
      { promptBg: "Тя ___ лекар, доколкото знам.", promptEn: "She is, as far as I know, a doctor.", correctAnswer: "била", options: ["била", "е", "беше", "бъде"] },
    ],
  },
  {
    title: "Relative clauses",
    description: "който, която, което, които",
    notes:
      "Който and its forms work like English \"who/which/that\", but agree in gender and number with the noun they refer back to (the antecedent), not with anything in the clause they introduce -- момичето, което видях (\"the girl [neuter noun момиче!] that I saw\") stays neuter because it agrees with момичето, even though a girl is naturally feminine. This mismatch between grammatical gender and natural gender is a common trap: always check the antecedent's grammatical gender, not the real-world gender of what it refers to, when picking който vs която vs което.",
    level: "B1",
    drills: [
      { promptBg: "Момичето, ___ видях вчера, е тук.", promptEn: "The girl I saw yesterday is here.", correctAnswer: "което", options: ["което", "който", "която", "които"] },
      { promptBg: "Мъжът, ___ говори, е моят баща.", promptEn: "The man who is speaking is my father.", correctAnswer: "който", options: ["който", "която", "което", "които"] },
      { promptBg: "Книгата, ___ чета, е интересна.", promptEn: "The book that I'm reading is interesting.", correctAnswer: "която", options: ["която", "който", "което", "които"] },
      { promptBg: "Хората, ___ познавам, са мили.", promptEn: "The people whom I know are nice.", correctAnswer: "които", options: ["които", "който", "която", "което"] },
    ],
  },

  // ---------- B2 ----------
  {
    title: "Passive voice (basic)",
    description: "е + past passive participle",
    notes:
      "The passive is built from съм (е, са...) plus a past passive participle formed with -н or -т (написан -- \"written\", построен -- \"built\"), which itself agrees in gender/number with the subject like an adjective: книгата е написана (feminine) vs романът е написан (masculine). It's noticeably less common in everyday spoken Bulgarian than in English -- Bulgarian tends to prefer an active sentence with an unspecified or reflexive subject instead (Тук се говори английски -- literally \"Here speaks itself English\" -- rather than a true passive \"English is spoken here\"), so recognize the passive more than you'll actively need to produce it.",
    level: "B2",
    drills: [
      { promptBg: "Книгата ___ от известен автор.", promptEn: "The book was written by a famous author.", correctAnswer: "е написана", options: ["е написана", "пише", "написа", "пишеше"] },
      { promptBg: "Къщата ___ през 1990 година.", promptEn: "The house was built in 1990.", correctAnswer: "е построена", options: ["е построена", "строи", "построи", "строеше"] },
    ],
  },
  {
    title: "Reported speech (basic)",
    description: "shifting a direct statement into an indirect one",
    notes:
      "Reported speech in Bulgarian is friendlier than English's: where English famously \"backshifts\" tense (\"I am tired\" → \"He said he was tired\"), Bulgarian generally keeps the original tense inside the че-clause (Той каза, че е уморен -- literally \"He said that he is tired\", present tense preserved). The real complexity is that Bulgarian has a second, competing way to report speech -- switching the reported verb into the renarrated mood (covered at B1) instead of using че at all -- and the two strategies overlap in meaning but carry different shades of the speaker's certainty about what's being reported.",
    level: "B2",
    drills: [
      { promptBg: "Той каза, че ___ уморен.", promptEn: "He said that he was tired.", correctAnswer: "е", options: ["е", "съм", "беше", "бил"] },
      { promptBg: "Тя обясни, че ___ работа утре.", promptEn: "She explained that she has work tomorrow.", correctAnswer: "има", options: ["има", "имам", "имаше", "имал"] },
    ],
  },
  {
    title: "Advanced connectors",
    description: "въпреки че (although), за да (in order to)",
    notes:
      "Въпреки че (\"although/despite the fact that\") and за да (\"in order to\") let you build the longer, more nuanced sentences that separate intermediate from advanced Bulgarian -- concession and purpose, rather than just cause-and-effect (защото/затова from A1). За да is doing the job English splits between \"to\" + infinitive and \"in order to\", but since Bulgarian has no infinitive, it always takes a full да-clause after it (Учих, за да мина изпита -- \"I studied [in order] to pass the exam\"), following the same да-construction pattern already seen with modal verbs.",
    level: "B2",
    drills: [
      { promptBg: "___ че съм зает, ще дойда.", promptEn: "Although I'm busy, I'll come.", correctAnswer: "Въпреки", options: ["Въпреки", "Защото", "Ако", "Затова"] },
      { promptBg: "Учих цяла нощ, ___ да мина изпита.", promptEn: "I studied all night in order to pass the exam.", correctAnswer: "за", options: ["за", "но", "и", "затова"] },
    ],
  },
];

async function main() {
  console.log("Clearing existing grammar content...");
  await db.delete(grammarTopics); // cascades to grammar_drills

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    const [row] = await db
      .insert(grammarTopics)
      .values({
        title: topic.title,
        description: topic.description,
        notes: topic.notes,
        level: topic.level,
        position: i + 1,
      })
      .returning();

    await db.insert(grammarDrills).values(
      topic.drills.map((d) => ({
        topicId: row.id,
        promptBg: d.promptBg,
        promptEn: d.promptEn,
        correctAnswer: d.correctAnswer,
        options: d.options,
      }))
    );
    console.log(`[${topic.level}] ${topic.title}: ${topic.drills.length} drills`);
  }

  console.log(`Done. ${TOPICS.length} topics.`);
}

main().then(() => process.exit(0));
