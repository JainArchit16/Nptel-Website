import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const { subjectId, week } = params
  console.log("Subject ID:", subjectId, "Week:", week)

  try {
    const questions = await prisma.question.findMany({
      where: {
        subjectId: Number.parseInt(subjectId),
        week: Number.parseInt(week),
      },
      select: {
        questionId: true,
        questionText: true,
        options: true,
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Error fetching questions" }, { status: 500 })
  }
}

