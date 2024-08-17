import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { folders } from "./folders";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  folder_id: serial("folder_id")
    .notNull()
    .references(() => folders.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  key: text("key").notNull(),
  url: text("url").notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
});
