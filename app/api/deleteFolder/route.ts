import { db } from "@/db";
import { folders } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Extract the ID from the request body

    if (!id) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    const result = await db.delete(folders).where(eq(folders.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
