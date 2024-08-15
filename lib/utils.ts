import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });
  return data[0].embedding;
};

import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { references } from "@/db/schema/references";

export const findSimilarReferences = async (input: string) => {
  const embedding = await generateEmbedding(input);
  const similarity = sql<number>`1 - (${cosineDistance(
    references.embedding,
    embedding
  )})`;
  const similarReferences = await db
    .select({
      id: references.id,
      document_id: references.document_id,
      content: references.content,
      similarity,
    })
    .from(references)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(3);
  return similarReferences;
};
