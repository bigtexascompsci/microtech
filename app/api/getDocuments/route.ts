import { db } from "@/db";
import { documents } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { folderId } = await req.json();

    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.folder_id, folderId));

    console.log(result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
