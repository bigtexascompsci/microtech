import { db } from "@/db";
import { documents, folders } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { folderId, file } = await req.json();

    console.log("Request data:", { folderId, file });

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder id is required" },
        { status: 400 }
      );
    }

    const result = await db.insert(documents).values({
      folder_id: folderId,
      name: file.name,
      type: file.type,
      key: file.key,
      url: file.url,
    });

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
