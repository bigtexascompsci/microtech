import { db } from "@/db";
import { chats } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { folderId } = await req.json();

    const result = await db
      .select()
      .from(chats)
      .where(eq(chats.folder_id, folderId));

    console.log(result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
