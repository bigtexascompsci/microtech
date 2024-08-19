import { db } from "@/db";
import { chats } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { folderId, chatName } = await req.json();

    console.log("Request data:", { folderId, chatName });

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder id is required" },
        { status: 400 }
      );
    }

    if (!folderId) {
      return NextResponse.json(
        { error: "Chat name is required" },
        { status: 400 }
      );
    }

    const result = await db.insert(chats).values({
      folder_id: folderId,
      name: chatName,
    });

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
