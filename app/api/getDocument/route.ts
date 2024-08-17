import { db } from "@/db";
import { documents } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json();

    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId));

    console.log(result);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
