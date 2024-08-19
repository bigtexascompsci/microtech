import { pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { folders } from "./folders";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  folder_id: serial("folder_id")
    .notNull()
    .references(() => folders.id),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
