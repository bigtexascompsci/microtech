import { db } from "@/db";
import { count, eq, sql } from "drizzle-orm";
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
        documents_count: sql`coalesce((SELECT COUNT(*) FROM documents WHERE documents.folder_id = folders.id), 0)`,
        chats_count: sql`coalesce((SELECT COUNT(*) FROM chats WHERE chats.folder_id = folders.id), 0)`,
      })
      .from(folders)
      .orderBy(folders.updated_at);

    for (let folder of result) {
      // Get the number of documents with folder_id = folderId
      const documentCount = await db
        .select({ value: count() })
        .from(documents)
        .where(eq(documents.folder_id, folder.id));

      // Get the number of chats with folder_id = folderId
      const chatCount = await db
        .select({ value: count() })
        .from(chats)
        .where(eq(chats.folder_id, folder.id));

      // Update folder in result
      folder.documents_count = documentCount[0].value;
      folder.chats_count = chatCount[0].value;
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
