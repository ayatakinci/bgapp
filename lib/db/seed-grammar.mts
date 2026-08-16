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
  drills: DrillSeed[];
};

const TOPICS: TopicSeed[] = [
  {
    title: "Question words",
    description: "кой, какво, къде, кога, защо, как, колко",
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
    drills: [
      { promptBg: "___ да говоря малко български.", promptEn: "I can speak a little Bulgarian.", correctAnswer: "Мога", options: ["Мога", "Трябва", "Искам", "Обичам"] },
      { promptBg: "___ да отида на лекар.", promptEn: "I need to go to the doctor.", correctAnswer: "Трябва", options: ["Трябва", "Мога", "Искам", "Знам"] },
      { promptBg: "___ да науча български.", promptEn: "I want to learn Bulgarian.", correctAnswer: "Искам", options: ["Искам", "Мога", "Трябва", "Обичам"] },
    ],
  },
  {
    title: "\"I like\"",
    description: "харесва ми / обичам",
    drills: [
      { promptBg: "Харесва ___ София.", promptEn: "I like Sofia.", correctAnswer: "ми", options: ["ми", "ти", "му", "ни"] },
      { promptBg: "___ кафе всяка сутрин.", promptEn: "I love coffee every morning.", correctAnswer: "Обичам", options: ["Обичам", "Харесвам", "Искам", "Мога"] },
      { promptBg: "___ тази книга.", promptEn: "I like this book.", correctAnswer: "Харесвам", options: ["Харесвам", "Обичам", "Искам", "Мога"] },
    ],
  },
  {
    title: "Future tense",
    description: "ще + verb",
    drills: [
      { promptBg: "Утре ___ работя.", promptEn: "Tomorrow I will work.", correctAnswer: "ще", options: ["ще", "не", "ли", "е"] },
      { promptBg: "___ говоря с теб утре.", promptEn: "I will speak with you tomorrow.", correctAnswer: "Ще", options: ["Ще", "Съм", "Беше", "Да"] },
      { promptBg: "Тя ___ дойде довечера.", promptEn: "She will come tonight.", correctAnswer: "ще", options: ["ще", "е", "беше", "да"] },
    ],
  },
  {
    title: "Past tense (basic)",
    description: "бях (I was), ядох, казах, отидох",
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
    drills: [
      { promptBg: "___ ми молив, моля.", promptEn: "Give me a pencil, please.", correctAnswer: "Дай", options: ["Дай", "Дайте", "Кажи", "Вземи"] },
      { promptBg: "___ ми истината.", promptEn: "Tell me the truth.", correctAnswer: "Кажи", options: ["Кажи", "Дай", "Кажете", "Вземи"] },
      { promptBg: "___, не разбирам.", promptEn: "Excuse me, I don't understand.", correctAnswer: "Извинете", options: ["Извинете", "Извини", "Моля", "Благодаря"] },
    ],
  },
  {
    title: "Connecting sentences",
    description: "и, но, защото, затова",
    drills: [
      { promptBg: "Обичам кафе, ___ не обичам чай.", promptEn: "I love coffee but I don't love tea.", correctAnswer: "но", options: ["но", "и", "защото", "затова"] },
      { promptBg: "Гладен съм ___ уморен.", promptEn: "I'm hungry and tired.", correctAnswer: "и", options: ["и", "но", "защото", "затова"] },
      { promptBg: "Не отидох, ___ валеше.", promptEn: "I didn't go because it was raining.", correctAnswer: "защото", options: ["защото", "затова", "и", "но"] },
      { promptBg: "Валеше, ___ не отидох.", promptEn: "It was raining, so I didn't go.", correctAnswer: "затова", options: ["затова", "защото", "и", "но"] },
    ],
  },
];

async function main() {
  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    const [row] = await db
      .insert(grammarTopics)
      .values({ title: topic.title, description: topic.description, position: i + 1 })
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
    console.log(`${topic.title}: ${topic.drills.length} drills`);
  }

  console.log(`Done. ${TOPICS.length} topics.`);
}

main().then(() => process.exit(0));
