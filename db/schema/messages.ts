import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { chats } from "./chats";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chat_id: serial("chat_id")
    .notNull()
    .references(() => chats.id),
  created_at: timestamp("created_at").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  embedding_ids: text("embedding_ids")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
});
