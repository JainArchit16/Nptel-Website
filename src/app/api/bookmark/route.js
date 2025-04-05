// app/api/bookmark/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { userId, questionId } = await request.json();
    const bookmark = await prisma.bookmarkedQuestion.create({
      data: {
        userId: Number(userId),
        questionId: Number(questionId),
      },
    });
    return NextResponse.json(bookmark, { status: 200 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Bookmark creation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId, questionId } = await request.json();
    const bookmark = await prisma.bookmarkedQuestion.deleteMany({
      where: {
        userId: Number(userId),
        questionId: Number(questionId),
      },
    });
    return NextResponse.json(bookmark, { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Bookmark removal failed" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
