import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../../../../../utils/authOptions";

const prisma = new PrismaClient();

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const performanceData = await prisma.quiz.findMany({
      where: { userId },
      select: {
        score: true,
        attemptTime: true,
      },
      orderBy: {
        attemptTime: "asc",
      },
    });

    return NextResponse.json(performanceData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch performance data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
