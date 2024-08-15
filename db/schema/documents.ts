import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { folders } from "./folders";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  folder_id: serial("folder_id")
    .notNull()
    .references(() => folders.id),
  name: text("name").notNull(),
  path: text("path").notNull(),
  type: text("type").notNull(),
  created_at: timestamp("created_at").notNull(),
});
