import { db } from "@/db";
import { messages } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import "dotenv/config";

import OpenAI from "openai";

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { chatId, content } = await req.json();

    // Step 1: Create USER message
    const userMessage = await db
      .insert(messages)
      .values({
        chat_id: chatId,
        role: "USER",
        content: content,
      })
      .returning(); // Return inserted user message to include in response

    // SEARCH VECTOR STORE ENGINE
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "do your best markzuckerberg impression",
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    const response: string = completion.choices[0].message.content || "NULL";

    // Step 2: Generate ASSISTANT message
    const assistantMessage = await db
      .insert(messages)
      .values({
        chat_id: chatId,
        role: "ASSISTANT",
        content: response,
        // ADD MOST SIMILAR TEXT-EMBEDDINGS
      })
      .returning(); // Return inserted assistant message to include in response

    // Step 3: Return both USER and ASSISTANT messages
    return NextResponse.json(
      {
        success: true,
        userMessage,
        assistantMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
