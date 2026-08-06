import "dotenv/config";
import { db } from "./index";
import { words } from "./schema";



await db.insert(words).values({
  bg: "здравей",
  en: "hello",
  partOfSpeech: "interjection",
});

const result = await db.select().from(words);
console.log(result);