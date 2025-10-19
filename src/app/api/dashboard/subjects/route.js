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
    const subjectAverages = await prisma.quiz.groupBy({
      by: ["subjectId"],
      where: { userId },
      _avg: { score: true },
    });

    const subjectData = await Promise.all(
      subjectAverages.map(async (item) => {
        const subject = await prisma.subject.findUnique({
          where: { subjectId: item.subjectId },
          select: { name: true },
        });
        return {
          subjectName: subject ? subject.name : "Unknown",
          averageScore: parseFloat(item._avg.score.toFixed(2)),
        };
      })
    );

    return NextResponse.json(subjectData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch subject mastery data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
