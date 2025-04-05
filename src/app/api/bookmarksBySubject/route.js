// app/api/bookmarksBySubject/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const bookmarks = await prisma.bookmarkedQuestion.findMany({
      where: { userId: Number(userId) },
      include: {
        question: {
          include: {
            subject: true,
          },
        },
      },
    });
    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching bookmarks" },
      { status: 500 }
    );
  }
}
