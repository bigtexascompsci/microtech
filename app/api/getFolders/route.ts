import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import { folders, documents, chats } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db
      .select({
        id: folders.id,
        name: folders.name,
        created_at: folders.created_at,
        updated_at: folders.updated_at,
        documents_count: count(documents.id),
        chats_count: count(chats.id),
      })
      .from(folders)
      .leftJoin(documents, eq(folders.id, documents.folder_id))
      .leftJoin(chats, eq(folders.id, chats.folder_id))
      .groupBy(folders.id)
      .orderBy(folders.updated_at);

    console.log(result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
