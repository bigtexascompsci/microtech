// Class Name Handling
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Font formatting
import { Inter } from "next/font/google";
import { Space_Mono } from "next/font/google";
export const inter = Inter({ subsets: ["latin"] });
export const space_mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Date formatting
export function formatTimestampToLocalTime(timestamp: Date) {
  // Parse timestamp
  const utcDate = new Date(timestamp);

  // Convert timestamp to local time
  const localDate = new Date(
    utcDate.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  const options = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric" as "numeric",
    month: "short" as "short",
    day: "numeric" as "numeric",
    hour: "2-digit" as "2-digit",
    minute: "2-digit" as "2-digit",
    hour12: true, // Enable AM/PM format
  };

  // Format the local date
  const formattedDate = localDate
    .toLocaleString("en-US", options)
    .replace(/,(?!.*,)/, " at");

  // Get the time zone abbreviation (e.g., CST)
  const timeZoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: "short",
  })
    .formatToParts(localDate)
    .find((part) => part.type === "timeZoneName")?.value;

  return `${formattedDate} ${timeZoneName}`; // Append time zone to formatted date
}

/*

// OpenAI Text Embeddings
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

// Drizzle ORM Similarity Search
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

*/
