import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
// Make sure to import your authOptions from where you've defined them
// e.g., import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "../../../../../utils/authOptions";

const prisma = new PrismaClient();

export async function GET(request) {
  // Use getServerSession for App Router
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const totalQuizzes = await prisma.quiz.count({ where: { userId } });

    const avgAccuracyResult = await prisma.quiz.aggregate({
      where: { userId },
      _avg: { accuracy: true },
    });
    const overallAverageAccuracy = avgAccuracyResult._avg.accuracy || 0;

    const subjectScores = await prisma.quiz.groupBy({
      by: ["subjectId"],
      where: { userId },
      _avg: { score: true },
      orderBy: { _avg: { score: "desc" } },
      take: 1,
    });

    let bestSubject = "N/A";
    if (subjectScores.length > 0) {
      const subject = await prisma.subject.findUnique({
        where: { subjectId: subjectScores[0].subjectId },
      });
      bestSubject = subject ? subject.name : "N/A";
    }

    const data = {
      totalQuizzes,
      overallAverageAccuracy: parseFloat(overallAverageAccuracy.toFixed(2)),
      bestSubject,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
