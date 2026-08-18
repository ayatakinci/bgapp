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
  // The rule/pattern itself -- short and structural.
  notes: string;
  // One complete, natural sentence demonstrating the rule (distinct from
  // the drills, which only ever show a blanked sentence).
  example: string;
  exampleTranslation: string;
  // A shorter "watch out for" nuance or common mistake.
  pitfall: string;
  level: "A1" | "A2" | "B1" | "B2";
  drills: DrillSeed[];
};

const TOPICS: TopicSeed[] = [
  // ---------- A1 ----------
  {
    title: "Cyrillic alphabet",
    description: "Аа Бб Вв Гг Дд… all 30 letters, upper & lower case",
    notes:
      "Bulgarian uses 30 Cyrillic letters, each with an uppercase and lowercase form. Most map to a single, consistent sound -- once you know a letter's sound, every word using it is pronounced exactly as written, unlike English spelling.",
    example: "Аз обичам България.",
    exampleTranslation: "I love Bulgaria.",
    pitfall:
      "A few letters look like Latin ones but sound completely different -- Р is \"r\" not \"p\", Н is \"n\" not \"h\", У is \"u\" not \"y\" -- reading these on autopilot from Latin habits is the single most common early mistake.",
    level: "A1",
    drills: [
      { promptBg: "Главната буква за 'б' е ___.", promptEn: "The uppercase letter for 'б' is ___.", correctAnswer: "Б", options: ["Б", "В", "П", "Р"] },
      { promptBg: "Малката буква за 'Ж' е ___.", promptEn: "The lowercase letter for 'Ж' is ___.", correctAnswer: "ж", options: ["ж", "х", "з", "щ"] },
      { promptBg: "Буквата 'Р' звучи като ___.", promptEn: "The letter 'Р' sounds like ___.", correctAnswer: "r", options: ["r", "p", "g", "n"] },
      { promptBg: "Буквата 'Н' звучи като ___.", promptEn: "The letter 'Н' sounds like ___.", correctAnswer: "n", options: ["n", "h", "p", "m"] },
      { promptBg: "Буквата 'У' звучи като ___.", promptEn: "The letter 'У' sounds like ___.", correctAnswer: "u", options: ["u", "y", "v", "i"] },
      { promptBg: "Главната буква за 'щ' е ___.", promptEn: "The uppercase letter for 'щ' is ___.", correctAnswer: "Щ", options: ["Щ", "Ш", "Ч", "Ц"] },
    ],
  },
  {
    title: "Personal pronouns",
    description: "аз, ти, той, тя, то, ние, вие, те",
    notes:
      "Bulgarian has eight personal pronouns: аз (I), ти (you, informal), той/тя/то (he/she/it, split by grammatical gender), ние (we), вие (you, formal/plural), те (they).",
    example: "Аз съм от Турция, а тя е от България.",
    exampleTranslation: "I am from Turkey, and she is from Bulgaria.",
    pitfall:
      "Той/тя/то tracks grammatical gender, not biological sex -- a neuter noun like дете (child) takes то even for a human child, which surprises English speakers used to \"he/she\" being about the person, not the word.",
    level: "A1",
    drills: [
      { promptBg: "Мария е тук. ___ е тук.", promptEn: "Maria is here. ___ is here.", correctAnswer: "Тя", options: ["Тя", "Той", "То", "Те"] },
      { promptBg: "Иван и Петър играят. ___ играят.", promptEn: "Ivan and Petar are playing. ___ are playing.", correctAnswer: "Те", options: ["Те", "Той", "Тя", "Ние"] },
      { promptBg: "Аз и ти сме приятели. ___ сме приятели.", promptEn: "You and I are friends. ___ are friends.", correctAnswer: "Ние", options: ["Ние", "Вие", "Те", "Аз"] },
      { promptBg: "Детето спи. ___ спи.", promptEn: "The child is sleeping. ___ is sleeping.", correctAnswer: "То", options: ["То", "Той", "Тя", "Те"] },
    ],
  },
  {
    title: "\"To be\" (съм)",
    description: "аз съм, ти си, той/тя/то е, ние сме, вие сте, те са",
    notes:
      "Съм is Bulgarian's only fully irregular verb -- every person (аз, ти, той...) has its own unique form, unlike regular verbs that share predictable endings.",
    example: "Аз съм учител, а ти си студент.",
    exampleTranslation: "I am a teacher, and you are a student.",
    pitfall:
      "The subject pronoun is often dropped entirely (\"студент съм\" works without \"аз\", since the ending already says who); negation just adds не before it (не съм), and questions add ли right after it, not a helper verb up front like English \"is he...?\".",
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
      "Verbs fall into three conjugation families based on their 1st-person-singular ending: -а/-я (чета), -и (говоря), and a smaller -е class. Once you know a verb's family, every other present-tense ending is fully predictable.",
    example: "Тя чете книга, а аз говоря по телефона.",
    exampleTranslation: "She is reading a book, and I am talking on the phone.",
    pitfall:
      "Stress can shift between forms of the same verb (говоря vs говорим) -- getting it wrong doesn't block understanding, but does mark you as a learner.",
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
    notes: "Negation just puts не directly before the verb -- no auxiliary \"do/does\" needed, unlike English.",
    example: "Не разбирам испански, но разбирам английски.",
    exampleTranslation: "I don't understand Spanish, but I understand English.",
    pitfall:
      "Double negation is required, not wrong: \"Не искам нищо\" (literally \"not I-want nothing\") is the only correct way to say \"I don't want anything\".",
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
      "Insert the tiny particle ли directly after the word being questioned -- almost always the verb -- to turn a statement into a yes/no question. No word-order inversion, no \"do/does\" support.",
    example: "Говориш ли английски?",
    exampleTranslation: "Do you speak English?",
    pitfall:
      "Ли can shift to question a different word specifically -- putting it after \"английски\" instead asks specifically about English, not about speaking in general.",
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
      "\"The\" is a suffix glued onto the end of the noun, not a separate word -- which suffix depends on gender: -та (feminine), -то (neuter), -ът/-я (masculine), -те (all plurals).",
    example: "Книгата е на масата, а столът е до прозореца.",
    exampleTranslation: "The book is on the table, and the chair is by the window.",
    pitfall:
      "Masculine nouns distinguish a subject form (-ът) from an object form (-а) in careful writing (столът sits vs. виждам стола), though spoken Bulgarian often blurs this.",
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
      "No single \"add -s\" rule -- plural formation depends on gender and the noun's ending. Feminine -а/-я swaps to -и (книга→книги); masculine typically adds -и (студент→студенти); neuter splits between -а and -та/-ета (дете→деца, куче→кучета).",
    example: "Имам две книги и едно куче.",
    exampleTranslation: "I have two books and one dog.",
    pitfall:
      "Short monosyllabic masculine nouns take a special counting form ending in -а used only after numbers 2-10: два часа, not два часове.",
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
      "Most question words behave like their English counterparts, but кой (\"who/which\") is unusual in agreeing in gender and number with what it's asking about: коя книга, кое дете, кои хора.",
    example: "Какво правиш и къде живееш?",
    exampleTranslation: "What are you doing and where do you live?",
    pitfall:
      "Как does double duty: besides \"how\" (Как си?), it's the standard way to ask someone's name (Как се казваш? -- literally \"how do you call yourself\"), not a \"what\" question like English expects.",
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
    notes: "Every adjective has four forms and must agree with the noun it describes: masculine, feminine (-а), neuter (-о), plural (-и).",
    example: "Той е добър приятел, а тя е добра учителка.",
    exampleTranslation: "He is a good friend, and she is a good teacher.",
    pitfall:
      "The masculine form is trickiest to guess from a dictionary entry -- добър drops its stem vowel in every other form (fem. добра, not \"добъра\").",
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
    notes: "Demonstratives agree in gender and number with their noun, just like adjectives: този мъж, тази жена, това дете, тези хора.",
    example: "Тази книга е моя, а онази е твоя.",
    exampleTranslation: "This book is mine, and that one (over there) is yours.",
    pitfall:
      "Bulgarian also keeps a separate \"that, over there\" set (онзи/онази/онова/онези) for things genuinely distant, a distinction English collapsed into just \"this\" vs \"that\" long ago.",
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
    notes: "Rather than a possessive word before the noun, Bulgarian attaches a short pronoun right after the (definite) noun: къщата ми -- literally \"the-house to-me\".",
    example: "Колата ми е нова, а къщата им е стара.",
    exampleTranslation: "My car is new, and their house is old.",
    pitfall:
      "These short forms are technically dative pronouns doing possession duty. Full possessive adjectives (мой, твой, негов...) exist too, but are reserved for emphasis or formal writing.",
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
      "В and на both cover ground English splits between \"in\", \"at\", and \"on\" -- в София (in Sofia) but на масата (on the table), на работа (at work) -- with no reliable rule, just usage learned noun by noun.",
    example: "Живея в София и работя на пазара.",
    exampleTranslation: "I live in Sofia and work at the market.",
    pitfall:
      "На also covers possession's \"of\" (къщата на Иван -- \"Ivan's house\"), since Bulgarian lost the genitive case other Slavic languages use for this.",
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
      "Bulgarian lost the infinitive entirely, so every modal construction uses да + a present-tense verb conjugated for the actual subject: искам да говоря (\"I want that-I speak\").",
    example: "Трябва да работя, но искам да почивам.",
    exampleTranslation: "I have to work, but I want to rest.",
    pitfall: "Трябва stays the same for every person (трябва да отида/отидеш/отиде...) -- only the verb after да changes, never трябва itself.",
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
      "Харесва ми flips the sentence English speakers expect: the thing liked is the subject, and the person liking it appears as a dative pronoun (Харесва ми София -- literally \"Sofia pleases to-me\").",
    example: "Харесва ми София, но обичам Пловдив повече.",
    exampleTranslation: "I like Sofia, but I love Plovdiv more.",
    pitfall:
      "Обичам is a normal transitive verb, but stronger -- used for both people you love and things you really like, so context decides whether it reads as \"love\" or just \"really like\".",
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
    notes: "Ще is an invariant particle before the present tense -- it never conjugates, no matter the subject: ще говоря, ще говориш, ще говори.",
    example: "Утре ще работя, но няма да ходя на училище.",
    exampleTranslation: "Tomorrow I will work, but I won't go to school.",
    pitfall: "The negative future isn't \"не ще\" -- it's a separate fixed pattern, няма да + present tense (няма да дойда, \"I won't come\").",
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
    notes: "The aorist is Bulgarian's default tense for narrating a single completed past event -- the one you'll use constantly telling someone what you did yesterday.",
    example: "Вчера ядох хляб и казах здравей на съседа.",
    exampleTranslation: "Yesterday I ate bread and said hello to the neighbor.",
    pitfall:
      "Aorist endings vary more by verb than the present tense's do -- common irregular-looking forms (бях, ядох, казах) are worth memorizing individually first.",
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
      "The imperative has just two forms per verb: one for ти (informal singular, дай) and one shared by вие -- both plural \"you all\" and formal singular \"you\" (дайте).",
    example: "Дай ми менюто, моля, и кажете ми цената.",
    exampleTranslation: "Give me the menu, please, and tell me the price.",
    pitfall:
      "Извинете is the formal/plural imperative of извинявам, used by default even toward one stranger -- the informal Извини would feel oddly familiar.",
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
      "И (\"and\"), но (\"but\"), защото (\"because\"), and затова (\"so/that's why\") cover most everyday sentence-linking -- защото points backward to a cause, затова forward to a consequence.",
    example: "Не отидох, защото валеше, и затова останах вкъщи.",
    exampleTranslation: "I didn't go because it was raining, and so I stayed home.",
    pitfall: "Защото and затова are near-mirror images of each other, which makes them easy to mix up at first.",
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
      "Bulgarian forces a choice between two past tenses every time: aorist for a single, completed, bounded event (четох); imperfect for something ongoing, repeated, or habitual (четях).",
    example: "Като дете живеех във Варна, но миналата година живях в София.",
    exampleTranslation: "As a child I used to live in Varna, but last year I lived in Sofia.",
    pitfall:
      "The useful test isn't tense-translation but asking \"was this one finished action, or a state/habit/backdrop?\" -- this is separate from verbal aspect (B1), which is a property of the verb itself.",
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
      "По- attaches to any adjective for \"more\" (голям→по-голям) and най- for \"most\" (най-голям) -- no irregular forms to memorize like English \"good/better/best\".",
    example: "Тази къща е по-голяма, но онази е най-голямата в града.",
    exampleTranslation: "This house is bigger, but that one is the biggest in the city.",
    pitfall: "Because по-/най- are prefixes, not separate words, they still fully agree in gender with the noun: по-голяма къща (feminine).",
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
    notes: "Ordinals behave as regular adjectives and agree in gender/number: първи, първа, първо, and plural първи.",
    example: "Той живее на третия етаж, а тя -- на първия.",
    exampleTranslation: "He lives on the third floor, and she on the first.",
    pitfall:
      "Първи (\"first\") is irregular, unrelated to the cardinal едно -- but from второ (\"second\") onward, most ordinals build predictably from the cardinal plus an adjective ending (три→трети).",
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
      "Се marks that the subject and object of the verb are the same person, and sits in a fixed early slot in the sentence -- not after the verb the way English \"-self\" pronouns do.",
    example: "Казвам се Иван и виждаме се утре.",
    exampleTranslation: "My name is Ivan (I call myself Ivan), and we'll see each other tomorrow.",
    pitfall:
      "Some verbs only ever exist with се (казвам се -- \"to be called\" -- means nothing as bare казвам in that sense), so these are worth learning as fixed units.",
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
      "Object pronouns come in two versions: short, unstressed clitic forms (го, ме, му...) for ordinary sentences, and long, stressed forms (него, мен...) after a preposition or for emphasis.",
    example: "Виждам го всеки ден, но подаръкът е за мен, не за него.",
    exampleTranslation: "I see him every day, but the gift is for me, not for him.",
    pitfall: "This is a real doubling system, not just style -- mixing up short and long forms is a very recognizable non-native mistake.",
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
      "Има and няма are invariant across every person and number -- unlike English \"there is\" vs \"there are\", Bulgarian just uses има or няма regardless of what follows.",
    example: "Има мляко в хладилника, но няма хляб.",
    exampleTranslation: "There is milk in the fridge, but there's no bread.",
    pitfall:
      "The related verb имам (\"to have\") does fully conjugate -- имам мляко (\"I have milk\") is a different sentence from Има мляко (\"There is milk\"), sharing a root but working differently.",
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
      "Most adverbs are simply an adjective's neuter singular form used on its own: бавен (\"slow\") becomes бавно (\"slowly\") -- the same -о already used for neuter agreement, no separate suffix needed.",
    example: "Той говори бавно, но работи добре.",
    exampleTranslation: "He speaks slowly, but works well.",
    pitfall:
      "A handful of high-frequency adverbs are irregular or unrelated to any adjective -- добре (\"well\") rather than a form of добър -- worth memorizing individually.",
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
    notes: "Ако clauses cover \"real\" conditionals -- things that genuinely could happen -- and pattern closely with English if-clauses: condition first, ще-future in the result.",
    example: "Ако вали утре, ще остана вкъщи.",
    exampleTranslation: "If it rains tomorrow, I'll stay home.",
    pitfall:
      "This is a separate, simpler system from the conditional mood (B1, бих/би...), which handles hypothetical or contrary-to-fact situations -- English \"if\" covers both with the same word, Bulgarian doesn't.",
    level: "A2",
    drills: [
      { promptBg: "___ вали, ще остана вкъщи.", promptEn: "If it rains, I'll stay home.", correctAnswer: "Ако", options: ["Ако", "Че", "Когато", "Затова"] },
      { promptBg: "___ имам пари, ще купя кола.", promptEn: "If I have money, I'll buy a car.", correctAnswer: "Ако", options: ["Ако", "Но", "И", "Защото"] },
    ],
  },
  {
    title: "Prepositions of time",
    description: "след, преди, през",
    notes: "След (\"after/in [duration]\") and преди (\"before/ago\") are mirror images on the timeline: преди обяд (\"before noon\"), след два часа (\"in two hours\").",
    example: "Пристигнах преди обяд и заминах след два часа.",
    exampleTranslation: "I arrived before noon and left two hours later.",
    pitfall: "През is the odd one out -- \"during/throughout\" a period (през 1990 година, през лятото) -- and is the one English speakers most often skip in favor of на or в.",
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
      "Most verbs come in pairs sharing a root but differing in aspect: imperfective for ongoing/repeated action (чета), perfective for a single completed action, often built with a prefix (прочета).",
    example: "Всеки ден чета вестника, но вчера прочетох цялата книга за един час.",
    exampleTranslation: "Every day I read the newspaper, but yesterday I read (finished) the whole book in one hour.",
    pitfall:
      "Aspect is a property of the verb itself, independent of tense -- more fundamental than the aorist-vs-imperfect choice (A2), which is about which past tense to conjugate into.",
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
    notes: "The conditional is built from a special short form of \"to be\" (бих, би, бихме) plus the l-participle -- the same participle used in the perfect tense and renarrated mood.",
    example: "Бих искал кафе, ако имате време.",
    exampleTranslation: "I would like a coffee, if you have time.",
    pitfall: "Beyond hypotheticals, бих is the standard polite way to soften a request -- Бих искал кафе reads noticeably more polite than the blunt Искам кафе.",
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
      "Verb forms built on the l-participle (бил, била, било...) signal the speaker didn't witness the event directly, but is reporting it secondhand or inferring it -- an evidentiality system with no real English equivalent.",
    example: "Той бил много добър студент, поне така ми казаха.",
    exampleTranslation: "He was, so I'm told, a very good student.",
    pitfall: "It shows up constantly in storytelling, gossip, and news reporting, and switching into it mid-conversation can subtly signal skepticism about what's being reported.",
    level: "B1",
    drills: [
      { promptBg: "Той ___ много добър студент, така ми казаха.", promptEn: "He was, I was told, a very good student.", correctAnswer: "бил", options: ["бил", "е", "беше", "бъде"] },
      { promptBg: "Тя ___ лекар, доколкото знам.", promptEn: "She is, as far as I know, a doctor.", correctAnswer: "била", options: ["била", "е", "беше", "бъде"] },
    ],
  },
  {
    title: "Relative clauses",
    description: "който, която, което, които",
    notes: "Който and its forms work like English \"who/which/that\", but agree in gender and number with the antecedent noun, not with anything in the clause they introduce.",
    example: "Книгата, която чета, е за момичето, което видях вчера.",
    exampleTranslation: "The book that I'm reading is about the girl I saw yesterday.",
    pitfall: "Момичето (\"girl\") is grammatically neuter, so \"the girl I saw\" takes което, not която -- always check the antecedent's grammatical gender, not real-world gender.",
    level: "B1",
    drills: [
      { promptBg: "Момичето, ___ видях вчера, е тук.", promptEn: "The girl I saw yesterday is here.", correctAnswer: "което", options: ["което", "който", "която", "които"] },
      { promptBg: "Мъжът, ___ говори, е моят баща.", promptEn: "The man who is speaking is my father.", correctAnswer: "който", options: ["който", "която", "което", "които"] },
      { promptBg: "Книгата, ___ чета, е интересна.", promptEn: "The book that I'm reading is interesting.", correctAnswer: "която", options: ["която", "който", "което", "които"] },
      { promptBg: "Хората, ___ познавам, са мили.", promptEn: "The people whom I know are nice.", correctAnswer: "които", options: ["които", "който", "която", "което"] },
    ],
  },
  {
    title: "Present perfect (съм + participle)",
    description: "чел съм, ходил съм -- an action with present relevance, not just a past narration",
    notes: "The perfect combines съм (fully conjugating for person) with a past active participle (the -л form) that agrees in gender/number with the subject: чел/чела/чело/чели.",
    example: "Аз съм чел тази книга два пъти.",
    exampleTranslation: "I have read this book twice.",
    pitfall: "It's used less for pinpointing when something happened -- that's the aorist's job -- and more for experience or present relevance.",
    level: "B1",
    drills: [
      { promptBg: "Аз съм ___ тази книга.", promptEn: "I have read this book.", correctAnswer: "чел", options: ["чел", "чета", "четох", "ще чета"] },
      { promptBg: "Ние сме ___ в България.", promptEn: "We have been to Bulgaria.", correctAnswer: "били", options: ["били", "сме", "бяхме", "бъдем"] },
      { promptBg: "Той е ___ писмото.", promptEn: "He has written the letter.", correctAnswer: "написал", options: ["написал", "пиша", "написах", "пишех"] },
    ],
  },
  {
    title: "Past active participles (-л forms)",
    description: "чел, писал, ходил -- the building block behind the perfect tense and the renarrated mood",
    notes:
      "Formed by adding -л/-ла/-ло/-ли to a verb's aorist or imperfect stem, the past active participle is the shared building block behind both the perfect tense (съм + participle) and the renarrated mood (бил + participle).",
    example: "Тя е прочела стотици книги и е написала три романа.",
    exampleTranslation: "She has read hundreds of books and has written three novels.",
    pitfall: "Learning to form the participle reliably for a verb pays off in two grammar systems at once, not just one.",
    level: "B1",
    drills: [
      { promptBg: "Тя е много начетена, защото е ___ стотици книги.", promptEn: "She's well-read because she has read hundreds of books.", correctAnswer: "прочела", options: ["прочела", "прочел", "прочело", "прочели"] },
      { promptBg: "Момчетата са ___ цял ден.", promptEn: "The boys have played all day.", correctAnswer: "играли", options: ["играли", "играл", "играла", "играло"] },
      { promptBg: "Учителката е ___ урока добре.", promptEn: "The [female] teacher has explained the lesson well.", correctAnswer: "обяснила", options: ["обяснила", "обяснил", "обяснило", "обяснили"] },
    ],
  },
  {
    title: "Combining direct & indirect object pronouns",
    description: "дай ми го -- both pronouns together, in fixed order",
    notes: "When a sentence needs both an indirect object pronoun (to/for whom) and a direct one (what), Bulgarian stacks them in a fixed order -- indirect before direct -- in the same clitic cluster.",
    example: "Дай ми го, моля те.",
    exampleTranslation: "Give it to me, please.",
    pitfall: "The whole two-pronoun cluster still has to sit in the clause's normal clitic position (right after the first stressed word), same rule as any single short pronoun.",
    level: "B1",
    drills: [
      { promptBg: "Дай ___, моля.", promptEn: "Give it to me, please.", correctAnswer: "ми го", options: ["ми го", "го ми", "ми", "го"] },
      { promptBg: "Той ___ показа.", promptEn: "He showed it to me.", correctAnswer: "ми я", options: ["ми я", "я ми", "ми", "я"] },
      { promptBg: "Тя ___ разказа историята.", promptEn: "She told it (the story) to us.", correctAnswer: "ни я", options: ["ни я", "я ни", "ни", "я"] },
    ],
  },
  {
    title: "Prefixed verbs of motion",
    description: "влизам/изляза, отивам/дойда, пристигам -- prefixes marking direction",
    notes:
      "A base motion root pairs with directional prefixes (в- into, из- out of, при- toward/arriving, за- turning aside...) to specify exactly which way something is moving -- Bulgarian marks direction grammatically, the way English uses entirely different words (\"go in\" vs \"come out\").",
    example: "Той влезе в стаята, а тя излезе от къщата.",
    exampleTranslation: "He entered the room, and she left the house.",
    pitfall: "The prefix typically shifts the verb's aspect (imperfective/perfective) at the same time, so the same handful of prefixes recombine meaningfully across dozens of motion verbs.",
    level: "B1",
    drills: [
      { promptBg: "Той ___ в стаята.", promptEn: "He entered the room.", correctAnswer: "влезе", options: ["влезе", "излезе", "отиде", "пристигна"] },
      { promptBg: "Тя ___ от къщата.", promptEn: "She left the house.", correctAnswer: "излезе", options: ["излезе", "влезе", "дойде", "замина"] },
      { promptBg: "Влакът ___ навреме.", promptEn: "The train arrived on time.", correctAnswer: "пристигна", options: ["пристигна", "замина", "влезе", "излезе"] },
    ],
  },

  // ---------- B2 ----------
  {
    title: "Passive voice (basic)",
    description: "е + past passive participle",
    notes: "The passive is built from съм (е, са) plus a past passive participle formed with -н or -т (написан, построен), which agrees in gender/number with the subject like an adjective.",
    example: "Книгата е написана от известен автор, а къщата е построена през 1990 година.",
    exampleTranslation: "The book was written by a famous author, and the house was built in 1990.",
    pitfall:
      "It's noticeably less common in spoken Bulgarian than in English -- Bulgarian prefers an active sentence with an unspecified/reflexive subject instead (Тук се говори английски, not a true passive).",
    level: "B2",
    drills: [
      { promptBg: "Книгата ___ от известен автор.", promptEn: "The book was written by a famous author.", correctAnswer: "е написана", options: ["е написана", "пише", "написа", "пишеше"] },
      { promptBg: "Къщата ___ през 1990 година.", promptEn: "The house was built in 1990.", correctAnswer: "е построена", options: ["е построена", "строи", "построи", "строеше"] },
    ],
  },
  {
    title: "Reported speech (basic)",
    description: "shifting a direct statement into an indirect one",
    notes: "Bulgarian is friendlier than English here: rather than \"backshifting\" tense, it keeps the original tense inside the че-clause (Той каза, че е уморен -- \"he said that he is tired\", present preserved).",
    example: "Тя обясни, че има работа утре.",
    exampleTranslation: "She explained that she has work tomorrow.",
    pitfall: "Bulgarian has a second, competing way to report speech -- switching into the renarrated mood instead of using че -- and the two strategies carry different shades of certainty.",
    level: "B2",
    drills: [
      { promptBg: "Той каза, че ___ уморен.", promptEn: "He said that he was tired.", correctAnswer: "е", options: ["е", "съм", "беше", "бил"] },
      { promptBg: "Тя обясни, че ___ работа утре.", promptEn: "She explained that she has work tomorrow.", correctAnswer: "има", options: ["има", "имам", "имаше", "имал"] },
    ],
  },
  {
    title: "Advanced connectors",
    description: "въпреки че (although), за да (in order to)",
    notes: "Въпреки че (\"although\") and за да (\"in order to\") build the longer, more nuanced sentences that separate intermediate from advanced Bulgarian -- concession and purpose, not just cause-and-effect.",
    example: "Въпреки че съм зает, ще дойда, за да те видя.",
    exampleTranslation: "Although I'm busy, I'll come in order to see you.",
    pitfall: "За да always takes a full да-clause after it, since Bulgarian has no infinitive -- the same да-construction pattern as modal verbs.",
    level: "B2",
    drills: [
      { promptBg: "___ че съм зает, ще дойда.", promptEn: "Although I'm busy, I'll come.", correctAnswer: "Въпреки", options: ["Въпреки", "Защото", "Ако", "Затова"] },
      { promptBg: "Учих цяла нощ, ___ да мина изпита.", promptEn: "I studied all night in order to pass the exam.", correctAnswer: "за", options: ["за", "но", "и", "затова"] },
    ],
  },
  {
    title: "Pluperfect (минало предварително време)",
    description: "бях направил -- an action completed before another past action",
    notes: "Bulgarian's \"past of the past\": бях/беше/бяхме + participle, exactly parallel to English \"had done\", used to sequence two past events and show which one happened first.",
    example: "Когато пристигнах, тя вече беше заминала.",
    exampleTranslation: "When I arrived, she had already left.",
    pitfall: "It shares the same participle as the present perfect and renarrated mood -- only the auxiliary's tense (бях, a past form of съм) changes.",
    level: "B2",
    drills: [
      { promptBg: "Когато се обадих, той вече ___ вечерята.", promptEn: "When I called, he had already eaten dinner.", correctAnswer: "беше изял", options: ["беше изял", "яде", "ще яде", "е ял"] },
      { promptBg: "Ние ___ преди да завали дъжд.", promptEn: "We had left before it started raining.", correctAnswer: "бяхме тръгнали", options: ["бяхме тръгнали", "тръгнахме", "тръгваме", "ще тръгнем"] },
      { promptBg: "Тя ___ писмото предния ден, преди да замина.", promptEn: "She had written the letter the day before, before I left.", correctAnswer: "беше написала", options: ["беше написала", "написа", "пише", "е написала"] },
    ],
  },
  {
    title: "Future in the past & future perfect",
    description: "щях да... (would have/was going to), ще съм направил (will have done)",
    notes: "Щях да + verb describes a plan or intention viewed from a past vantage point -- \"was going to\" -- very often specifically one that didn't happen. Ще съм + participle is the future perfect, \"will have done [by some point]\".",
    example: "Щях да дойда, но се разболях; до утре ще съм се възстановил.",
    exampleTranslation: "I was going to come, but I got sick; by tomorrow I will have recovered.",
    pitfall: "Щях да strongly implies the plan fell through -- it's rarely used for a plan that actually happened.",
    level: "B2",
    drills: [
      { promptBg: "___ да дойда, но се разболях.", promptEn: "I was going to come, but I got sick.", correctAnswer: "Щях", options: ["Щях", "Ще", "Бих", "Щеше"] },
      { promptBg: "До утре ___ завършил проекта.", promptEn: "By tomorrow I will have finished the project.", correctAnswer: "ще съм", options: ["ще съм", "съм", "бях", "ще бъда"] },
      { promptBg: "Тя ___ да ми се обади, но забрави.", promptEn: "She was going to call me, but forgot.", correctAnswer: "щеше", options: ["щеше", "ще", "беше", "би"] },
    ],
  },
  {
    title: "Gerund / adverbial participle (деепричастие)",
    description: "четейки -- doing something while doing something else",
    notes: "Adding -(е)йки to a verb stem builds an adverbial participle describing an action happening at the same time as the main verb, folding two clauses into one compact sentence.",
    example: "Четейки вестника, той пиеше кафе.",
    exampleTranslation: "While reading the newspaper, he drank coffee.",
    pitfall: "It's mostly a written/literary construction, not something you'll hear constantly in casual speech -- see stylistic register, next.",
    level: "B2",
    drills: [
      { promptBg: "___ вестника, той пиеше кафе.", promptEn: "While reading the newspaper, he drank coffee.", correctAnswer: "Четейки", options: ["Четейки", "Чета", "Четох", "Прочетох"] },
      { promptBg: "___ по улицата, тя срещна приятелка.", promptEn: "While walking down the street, she met a friend.", correctAnswer: "Вървейки", options: ["Вървейки", "Върви", "Вървя", "Вървях"] },
      { promptBg: "___ вратата, той извика.", promptEn: "While opening the door, he shouted.", correctAnswer: "Отваряйки", options: ["Отваряйки", "Отвори", "Отварям", "Отворих"] },
    ],
  },
  {
    title: "Nominalization & complex noun phrases",
    description: "четене, писане -- turning verbs into abstract nouns",
    notes: "The suffix -не turns a verb into an abstract \"-ing\" noun -- чета→четене (\"reading\"), пиша→писане (\"writing\") -- which formal and written Bulgarian leans on to build dense noun phrases instead of full clauses.",
    example: "Четенето е полезно, а писането отне месец.",
    exampleTranslation: "Reading is beneficial, and the writing took a month.",
    pitfall:
      "След завършването на проекта (\"after the completion of the project\") reads as more official than the equivalent full clause след като проектът завърши -- matters most for reading official/academic text.",
    level: "B2",
    drills: [
      { promptBg: "___ на книгата отне месец.", promptEn: "The writing of the book took a month.", correctAnswer: "Писането", options: ["Писането", "Пиша", "Писах", "Пишех"] },
      { promptBg: "___ е полезно за здравето.", promptEn: "Reading is good for your health.", correctAnswer: "Четенето", options: ["Четенето", "Чета", "Прочетох", "Четях"] },
      { promptBg: "След ___ на проекта, всички си починаха.", promptEn: "After the completion of the project, everyone rested.", correctAnswer: "завършването", options: ["завършването", "завърших", "завършвам", "завърша"] },
    ],
  },
  {
    title: "Stylistic register: formal vs. colloquial",
    description: "вие vs ти, official vs everyday word choices",
    notes: "Вие (formal \"you\", also for one respected person, like French vous) vs. informal ти is the most visible register marker, but the shift runs through vocabulary too.",
    example: "\"Уведомявам Ви\" е официално; \"казвам ти\" е разговорно.",
    exampleTranslation: "\"I hereby notify you\" is formal; \"I'm telling you\" is colloquial.",
    pitfall: "There's no single rule for word-choice register the way there is for verb conjugation -- it's built mostly from exposure to real forms, news, and conversation.",
    level: "B2",
    drills: [
      { promptBg: "На официален бланка пишем ___, а не 'ти'.", promptEn: "On an official form we write 'Vie', not 'ti'.", correctAnswer: "Вие", options: ["Вие", "Ти", "Вас", "Тебе"] },
      { promptBg: "'Уведомявам Ви, че...' е ___ стил.", promptEn: "This is a ___ style.", correctAnswer: "официален", options: ["официален", "разговорен", "детски", "поетичен"] },
      { promptBg: "'Дай телефона' е по-___ от 'Бихте ли ми дали телефона си'.", promptEn: "'Give me the phone' is more ___ than 'Would you give me your phone'.", correctAnswer: "разговорно", options: ["разговорно", "официално", "старинно", "книжовно"] },
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
        example: topic.example,
        exampleTranslation: topic.exampleTranslation,
        pitfall: topic.pitfall,
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
