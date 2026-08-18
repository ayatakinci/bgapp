import "dotenv/config";
import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { lessons, lessonWords, words } from "./schema";

// One-time content cleanup: the 18 "Extra vocabulary N" lessons were a raw,
// unthemed dump of leftover Wiktionary frequency-list words -- no relation
// to each other, mixed with bare grammar particles (и, а, с, в...) and two
// words that never should have shipped at all. This replaces them with:
//   1. real thematic lessons (Animals, Body & health, etc.)
//   2. words merged into the existing curated lessons where they fit
//      (an extra food word goes into "Food & drink", not a new lesson)
//   3. function words / pronouns dropped entirely -- they're grammar,
//      already covered by the Grammar section, not vocabulary
//   4. the two vulgar words dropped entirely

type Category =
  | "animals"
  | "nature"
  | "body"
  | "home"
  | "science"
  | "arts"
  | "society"
  | "colors"
  | "emotions"
  | "nationalities"
  | "people" // append into existing "Family & people"
  | "food" // append into existing "Food & drink"
  | "numbers" // append into existing "Numbers & time"
  | "verbs" // append into existing "Common verbs"
  | "adjectives" // append into existing "Common adjectives"
  | "places" // append into existing "City & directions"
  | "skip"; // function words, abbreviations, vulgar, inflected duplicates

// bg word -> category. Built by reviewing every word actually sitting in
// the 18 "Extra vocabulary" lessons.
const CATEGORY: Record<string, Category> = {
  // ---- Extra vocabulary 1 ----
  указ: "society", палец: "body", кот: "animals", брашно: "food", скот: "animals",
  водка: "food", царица: "people", лисица: "animals", по: "skip", чесън: "food",
  лук: "food", любовник: "people", почти: "skip", птица: "animals", дом: "home",
  работа: "society", камера: "home", нет: "home", сера: "skip", мой: "skip",
  поглеждам: "verbs", око: "body", слава: "emotions", комар: "animals", дома: "home",

  // ---- Extra vocabulary 2 ----
  лис: "adjectives", лиса: "animals", цена: "society", сова: "animals", господин: "people",
  лес: "nature", стена: "verbs", из: "skip", анархия: "society", вуйчо: "people",
  калий: "science", среда: "numbers", крава: "animals", носорог: "animals", игра: "arts",
  очи: "body", книга: "arts", сравнение: "society", мир: "emotions", твой: "skip",
  ваш: "skip", наш: "skip", свой: "skip", козел: "animals", два: "numbers",

  // ---- Extra vocabulary 3 ----
  пес: "animals", чад: "nature", керамика: "arts", знак: "society", цар: "people",
  кола: "places", хомосексуален: "people", хомосексуалист: "people", гей: "people", облак: "nature",
  речник: "arts", кит: "animals", рода: "people", руски: "nationalities", но: "skip",
  цунами: "nature", "г.": "skip", слово: "arts", река: "verbs", град: "places",
  уран: "science", луна: "nature", планета: "nature", презиме: "people", астероид: "science",

  // ---- Extra vocabulary 4 ----
  пояс: "home", марс: "home", говор: "arts", жаба: "animals", азбука: "arts",
  библия: "arts", биология: "science", молитва: "arts", молба: "society", слон: "animals",
  зебра: "animals", пица: "food", жираф: "animals", квадрат: "colors", звезда: "nature",
  длан: "body", море: "nature", черен: "colors", черно: "colors", храм: "arts",
  морски: "nature", пророк: "arts", меркурий: "science", степен: "society", бог: "arts",

  // ---- Extra vocabulary 5 ----
  народ: "society", перо: "nature", стол: "home", стотина: "numbers", океан: "nature",
  господа: "people", или: "skip", туш: "arts", се: "skip", овца: "animals",
  школа: "society", факултет: "society", генерал: "society", стрела: "home", академия: "society",
  армия: "society", вагон: "places", отец: "people", университет: "society", долина: "nature",
  писмо: "society", латински: "nationalities", абсурд: "emotions", аванс: "society", авантюра: "emotions",

  // ---- Extra vocabulary 6 ----
  авиация: "places", автобиография: "arts", автор: "arts", авторитет: "society", администратор: "society",
  активно: "skip", анализ: "science", пчела: "animals", базар: "places", бал: "arts",
  балет: "arts", балкон: "home", банка: "places", беда: "emotions", бедствие: "emotions",
  безобразие: "emotions", биография: "arts", блузка: "home", брак: "people", булка: "people",
  буря: "nature", век: "numbers", велосипед: "places", война: "society", враг: "emotions",

  // ---- Extra vocabulary 7 ----
  яд: "emotions", дракон: "arts", призрак: "arts", таван: "home", балерина: "arts",
  акула: "animals", ананас: "food", ангел: "arts", род: "people", пол: "people",
  женски: "people", номер: "numbers", бар: "places", изложба: "arts", клон: "nature",
  сам: "emotions", автостоп: "places", мост: "places", на: "skip", до: "skip",
  хинди: "nationalities", катедрала: "arts", катран: "home", сок: "food", малина: "food",

  // ---- Extra vocabulary 8 ----
  друг: "skip", градски: "places", кокаин: "society", мама: "people", клуб: "places",
  остров: "nature", федерация: "society", англичанин: "nationalities", англичанка: "nationalities", тротоар: "places",
  киви: "food", елей: "arts", времена: "numbers", врата: "home", със: "skip",
  във: "skip", юг: "places", вина: "emotions", градът: "skip", градове: "skip",
  говорите: "skip", ухо: "body", залив: "nature", добра: "skip", зелен: "colors",

  // ---- Extra vocabulary 9 ----
  синьо: "colors", бял: "colors", календар: "numbers", само: "skip", зареждам: "verbs",
  инвалид: "body", без: "skip", веранда: "home", кислород: "science", култура: "arts",
  дон: "people", север: "places", ястреб: "animals", хром: "science", запад: "places",
  нос: "body", него: "skip", нож: "home", нас: "skip", говно: "skip",
  скоро: "numbers", страх: "emotions", царство: "society", делфин: "animals", кожа: "body",

  // ---- Extra vocabulary 10 ----
  ваза: "home", заек: "animals", икона: "arts", мечка: "animals", къртица: "animals",
  злато: "colors", кон: "animals", видра: "animals", магаре: "animals", таралеж: "animals",
  котка: "animals", вълк: "animals", камила: "animals", мамут: "animals", кост: "body",
  патка: "animals", цвят: "colors", живот: "emotions", чаша: "home", огледало: "home",
  храна: "food", могила: "nature", моряк: "society", пшеница: "food", родина: "society",

  // ---- Extra vocabulary 11 ----
  комета: "nature", телевизор: "home", па: "skip", после: "numbers", библиотека: "society",
  област: "places", са: "skip", куб: "colors", дух: "arts", душа: "emotions",
  пекар: "society", отчаяние: "emotions", общество: "society", манастир: "arts", ум: "emotions",
  система: "science", формула: "science", хуй: "skip", ваше: "skip", искра: "nature",
  куче: "animals", мнение: "emotions", сребро: "colors", гений: "people", тема: "society",

  // ---- Extra vocabulary 12 ----
  дан: "society", дар: "society", вече: "numbers", доктор: "society", лава: "nature",
  меч: "home", кости: "skip", пити: "skip", харем: "society", ад: "arts",
  хармоника: "arts", пингвин: "animals", мачка: "animals", артист: "arts", архитектура: "arts",
  аудитория: "society", багаж: "places", лист: "nature", бре: "skip", ядро: "science",
  страна: "places", буква: "arts", ураган: "nature", ред: "society", клише: "arts",

  // ---- Extra vocabulary 13 ----
  сръбски: "nationalities", звук: "science", глас: "body", образ: "arts", дева: "people",
  мечта: "emotions", алигатор: "animals", секс: "body", измет: "home", коридор: "home",
  телефон: "home", кухня: "home", фигура: "colors", бор: "nature", ала: "skip",
  роман: "arts", водород: "science", азот: "science", олово: "science", литий: "science",
  платина: "colors", клетва: "society", орел: "animals", испански: "nationalities", хлор: "science",

  // ---- Extra vocabulary 14 ----
  фосфор: "science", натрий: "science", титан: "science", сладолед: "food", паун: "animals",
  фазан: "animals", евро: "society", султан: "people", варварин: "society", варварски: "adjectives",
  пара: "science", екран: "home", мрамор: "colors", ръка: "body", хор: "arts",
  коса: "body", планина: "nature", гора: "nature", водопад: "nature", марка: "society",
  долар: "society", ли: "skip", груб: "adjectives", хула: "emotions", глупак: "people",

  // ---- Extra vocabulary 15 ----
  будала: "people", халат: "home", буре: "home", памук: "home", праг: "home",
  лед: "nature", фотография: "arts", политика: "society", турски: "nationalities", грах: "food",
  под: "home", спрат: "skip", нова: "skip", мрежа: "home", младеж: "people",
  хвала: "emotions", човек: "people", набор: "society", привет: "society", та: "skip",
  изречение: "arts", бомба: "society", сан: "society", ада: "nature", бара: "nature",

  // ---- Extra vocabulary 16 ----
  спирт: "food", урок: "arts", лак: "home", рак: "animals", поток: "nature",
  сено: "nature", мак: "nature", мед: "food", метеор: "nature", миг: "numbers",
  комитет: "society", кого: "skip", див: "adjectives", теория: "science", футбол: "arts",
  интерес: "emotions", журнал: "arts", герой: "people", история: "arts", училище: "society",
  кака: "people", стих: "arts", секунда: "numbers", право: "society", роб: "people",

  // ---- Extra vocabulary 17 ----
  лайка: "nature", такса: "society", ни: "skip", ким: "food", беседа: "society",
  тесто: "food", много: "skip", самозванец: "people", стрелка: "home", о: "skip",
  с: "skip", а: "skip", в: "skip", е: "skip", и: "skip",
  у: "skip", я: "skip", безусловно: "skip", цифра: "numbers", хаос: "emotions",
  учение: "arts", против: "skip", авария: "places", вид: "society", "м.": "skip",

  // ---- Extra vocabulary 18 ----
  "зам.": "skip", кал: "nature", кокос: "food", слама: "nature", триста: "numbers",
  му: "skip", внук: "people", уста: "body", труд: "society", греда: "home",
  внучка: "people", за: "skip", сапун: "home",
};

const NEW_LESSON_META: Record<Exclude<Category, "skip" | "people" | "food" | "numbers" | "verbs" | "adjectives" | "places">, { title: string; level: "A1" | "A2" | "B1" | "B2" }> = {
  animals: { title: "Animals", level: "A1" },
  colors: { title: "Colors, shapes & materials", level: "A1" },
  nature: { title: "Nature, weather & the sky", level: "A2" },
  body: { title: "Body & health", level: "A2" },
  home: { title: "Home & everyday objects", level: "A2" },
  nationalities: { title: "Nationalities & languages", level: "A2" },
  emotions: { title: "Emotions & feelings", level: "B1" },
  society: { title: "Society, work & abstract ideas", level: "B1" },
  science: { title: "Science & elements", level: "B1" },
  arts: { title: "Arts, religion & culture", level: "B2" },
};

// Existing curated lessons (by title) that some words merge into instead
// of getting a new lesson.
const APPEND_TARGETS: Record<"people" | "food" | "numbers" | "verbs" | "adjectives" | "places", string> = {
  people: "Family & people",
  food: "Food & drink",
  numbers: "Numbers & time",
  verbs: "Common verbs",
  adjectives: "Common adjectives",
  places: "City & directions",
};

async function main() {
  const extraLessons = await db
    .select({ id: lessons.id, title: lessons.title })
    .from(lessons)
    .where(inArray(lessons.title, Array.from({ length: 18 }, (_, i) => `Extra vocabulary ${i + 1}`)));

  const extraLessonIds = extraLessons.map((l) => l.id);
  console.log(`Found ${extraLessons.length} "Extra vocabulary" lessons to dissolve.`);

  const wordRows = await db
    .select({ lessonId: lessonWords.lessonId, wordId: lessonWords.wordId, bg: words.bg })
    .from(lessonWords)
    .innerJoin(words, eq(lessonWords.wordId, words.id))
    .where(inArray(lessonWords.lessonId, extraLessonIds));

  console.log(`Found ${wordRows.length} word associations across those lessons.`);

  const missing = wordRows.filter((w) => !(w.bg in CATEGORY));
  if (missing.length > 0) {
    console.log("WARNING: words with no category assigned (will be skipped):");
    missing.forEach((w) => console.log(" -", w.bg));
  }

  // 1. Remove all lesson_words rows for the 18 extra lessons -- every
  // word gets re-placed below (or dropped, for "skip").
  await db.delete(lessonWords).where(inArray(lessonWords.lessonId, extraLessonIds));

  // 2. Set levels on the original 12 curated lessons (all A1 -- they're
  // the foundational vocab set).
  await db
    .update(lessons)
    .set({ level: "A1" })
    .where(inArray(lessons.title, [
      "Greetings & politeness", "About me", "Family & people", "Food & drink",
      "Shopping & money", "Numbers & time", "Days & months", "City & directions",
      "Common verbs", "Common adjectives", "Question words", "Emergencies & health",
    ]));

  const appendTargetIds = new Map<string, number>();
  for (const title of Object.values(APPEND_TARGETS)) {
    const [row] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.title, title));
    if (!row) throw new Error(`Expected existing lesson "${title}" not found`);
    appendTargetIds.set(title, row.id);
  }

  // 3. Repurpose 10 of the 18 extra-lesson rows into the new thematic
  // lessons (reusing ids keeps things simple), positioned right after the
  // original 12. Delete the remaining unused extra-lesson rows.
  const newCategoryKeys = Object.keys(NEW_LESSON_META) as (keyof typeof NEW_LESSON_META)[];
  const newLessonIds = new Map<string, number>();
  let nextPosition = 13;
  for (let i = 0; i < newCategoryKeys.length; i++) {
    const category = newCategoryKeys[i];
    const meta = NEW_LESSON_META[category];
    const reused = extraLessons[i];
    await db
      .update(lessons)
      .set({ title: meta.title, description: null, level: meta.level, position: nextPosition })
      .where(eq(lessons.id, reused.id));
    newLessonIds.set(category, reused.id);
    nextPosition++;
    console.log(`Repurposed lesson ${reused.id} -> "${meta.title}" (${meta.level})`);
  }

  const unusedLessonIds = extraLessons.slice(newCategoryKeys.length).map((l) => l.id);
  if (unusedLessonIds.length > 0) {
    await db.delete(lessons).where(inArray(lessons.id, unusedLessonIds));
    console.log(`Deleted ${unusedLessonIds.length} now-unused lesson rows.`);
  }

  // 4. Re-insert lesson_words: new thematic lessons + merges into
  // existing curated lessons. Skip categories drop the word entirely
  // from lessons (it stays in `words`/`sentences`, just isn't taught as
  // vocabulary -- either a grammar function word or, for two words, a
  // vulgar entry that should never have been included).
  const inserts: { lessonId: number; wordId: number }[] = [];
  const seen = new Set<string>(); // dedupe (lessonId, wordId) since a word may repeat across old lessons
  for (const w of wordRows) {
    const category = CATEGORY[w.bg];
    if (!category || category === "skip") continue;

    let targetLessonId: number | undefined;
    if (category in APPEND_TARGETS) {
      targetLessonId = appendTargetIds.get(APPEND_TARGETS[category as keyof typeof APPEND_TARGETS]);
    } else {
      targetLessonId = newLessonIds.get(category);
    }
    if (!targetLessonId) continue;

    const key = `${targetLessonId}:${w.wordId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    inserts.push({ lessonId: targetLessonId, wordId: w.wordId });
  }

  if (inserts.length > 0) {
    await db.insert(lessonWords).values(inserts).onConflictDoNothing();
  }
  console.log(`Inserted ${inserts.length} lesson_words rows across new/merged lessons.`);

  const droppedCount = wordRows.length - inserts.length;
  console.log(`Dropped ${droppedCount} words entirely (function words, abbreviations, vulgar entries).`);
}

main().then(() => process.exit(0));
