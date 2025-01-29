import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../utils/authOptions"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { subjectId, week, answers } = await request.json()
    const userId = session.user.id

    console.log("Received data:", { subjectId, week, answers, userId })

    // Fetch questions for the specified subject and week
    const questions = await prisma.question.findMany({
      where: { subjectId, week },
    })

    if (!questions.length) {
      return NextResponse.json({ error: "No questions found for the given subject and week." }, { status: 404 })
    }

    let score = 0
    const totalQuestions = questions.length
    const userAnswers = []
    const correctAnswers = {}

    questions.forEach((question) => {
      correctAnswers[question.questionId] = question.options[question.correctOption]
    })

    // Evaluate answers and calculate score
    answers.forEach(({ questionId, selectedOption }) => {
      const question = questions.find((q) => q.questionId === questionId)
      if (!question) {
        console.warn(`Question with ID ${questionId} not found`)
        return
      }
      const isCorrect = question.options[question.correctOption] === selectedOption

      if (isCorrect) score += 1

      userAnswers.push({
        questionId,
        selectedOption,
        isCorrect,
      })
    })

    const scorePercentage = (score / totalQuestions) * 100

    // Create a quiz record
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        subjectId,
        week,
        score: scorePercentage,
        accuracy: score / totalQuestions,
      },
    })

    // Add user answers to the database
    for (const answer of userAnswers) {
      await prisma.userAnswer.create({
        data: {
          quizId: quiz.quizId,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: answer.isCorrect,
        },
      })
    }

    console.log("Quiz submitted successfully:", { quizId: quiz.quizId, score: scorePercentage })

    return NextResponse.json({
      score: scorePercentage,
      correctAnswers,
    })
  } catch (error) {
    console.error("Error in quiz submission:", error)
    return NextResponse.json({ error: "An error occurred while submitting the quiz." }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

