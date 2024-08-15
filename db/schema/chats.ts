import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { folders } from "./folders";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  folder_id: serial("folder_id")
    .notNull()
    .references(() => folders.id),
  created_at: timestamp("created_at").notNull(),
});
