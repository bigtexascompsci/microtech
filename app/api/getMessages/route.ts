import { db } from "@/db";
import { messages } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { chatId } = await req.json();

    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chat_id, chatId))
      .orderBy(messages.created_at);

    console.log(result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
