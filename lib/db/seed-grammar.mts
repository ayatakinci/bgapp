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
  level: "A1" | "A2" | "B1" | "B2";
  drills: DrillSeed[];
};

const TOPICS: TopicSeed[] = [
  // ---------- A1 ----------
  {
    title: "\"To be\" (съм)",
    description: "аз съм, ти си, той/тя/то е, ние сме, вие сте, те са",
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
    level: "A2",
    drills: [
      { promptBg: "___ вали, ще остана вкъщи.", promptEn: "If it rains, I'll stay home.", correctAnswer: "Ако", options: ["Ако", "Че", "Когато", "Затова"] },
      { promptBg: "___ имам пари, ще купя кола.", promptEn: "If I have money, I'll buy a car.", correctAnswer: "Ако", options: ["Ако", "Но", "И", "Защото"] },
    ],
  },
  {
    title: "Prepositions of time",
    description: "след, преди, през",
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
    level: "B1",
    drills: [
      { promptBg: "Той ___ много добър студент, така ми казаха.", promptEn: "He was, I was told, a very good student.", correctAnswer: "бил", options: ["бил", "е", "беше", "бъде"] },
      { promptBg: "Тя ___ лекар, доколкото знам.", promptEn: "She is, as far as I know, a doctor.", correctAnswer: "била", options: ["била", "е", "беше", "бъде"] },
    ],
  },
  {
    title: "Relative clauses",
    description: "който, която, което, които",
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
    level: "B2",
    drills: [
      { promptBg: "Книгата ___ от известен автор.", promptEn: "The book was written by a famous author.", correctAnswer: "е написана", options: ["е написана", "пише", "написа", "пишеше"] },
      { promptBg: "Къщата ___ през 1990 година.", promptEn: "The house was built in 1990.", correctAnswer: "е построена", options: ["е построена", "строи", "построи", "строеше"] },
    ],
  },
  {
    title: "Reported speech (basic)",
    description: "shifting a direct statement into an indirect one",
    level: "B2",
    drills: [
      { promptBg: "Той каза, че ___ уморен.", promptEn: "He said that he was tired.", correctAnswer: "е", options: ["е", "съм", "беше", "бил"] },
      { promptBg: "Тя обясни, че ___ работа утре.", promptEn: "She explained that she has work tomorrow.", correctAnswer: "има", options: ["има", "имам", "имаше", "имал"] },
    ],
  },
  {
    title: "Advanced connectors",
    description: "въпреки че (although), за да (in order to)",
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
