import { index, pgTable, serial, text, vector } from "drizzle-orm/pg-core";

import { documents } from "./documents";

export const references = pgTable(
  "references",
  {
    id: serial("id").primaryKey(),
    document_id: serial("id")
      .notNull()
      .references(() => documents.id),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 256 }),
  },
  (table) => ({
    embedding_index: index("embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);
