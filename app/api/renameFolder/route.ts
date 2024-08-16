import { db } from "@/db";
import { folders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json(); // Extract the ID from the request body

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Folder id is required" },
        { status: 400 }
      );
    }

    const result = await db
      .update(folders)
      .set({ name: name })
      .where(eq(folders.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to rename folder" },
      { status: 500 }
    );
  }
}
