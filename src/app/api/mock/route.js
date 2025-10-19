import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    console.log("Correct API called")

    const { subjectId, week, answers, userId } = await req.json()

    // Basic validation
    if (!subjectId || !answers || !userId) {
      return NextResponse.json(
        { message: "Missing required fields in the request body." },
        { status: 400 }
      )
    }

    // Get all unique question IDs from answers
    const uniqueQuestionIds = [...new Set(answers.map((ans) => ans.questionId))]

    // Fetch all required questions from DB
    const questions = await prisma.question.findMany({
      where: { questionId: { in: uniqueQuestionIds } },
    })

    // Map for quick access
    const questionMap = {}
    questions.forEach((q) => {
      questionMap[q.questionId] = q
    })

    let correctCount = 0

    const userAnswersData = answers.map((ans) => {
      const question = questionMap[ans.questionId]

      if (!question) {
        throw new Error(`Question not found for questionId: ${ans.questionId}`)
      }

      // Determine correct answer
      const correctAnswer = typeof question.correctOption === 'number'
        ? question.options[question.correctOption]
        : question.correctOption

      const isCorrect = ans.selectedOption.trim().toLowerCase() === correctAnswer.trim().toLowerCase()

      if (isCorrect) correctCount++

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      }
    })

    const totalQuestions = uniqueQuestionIds.length
    const scorePercentage = parseFloat(((correctCount / totalQuestions) * 100).toFixed(2))

    // Store quiz result
    const quizRecord = await prisma.quiz.create({
      data: {
        userId,
        subjectId,
        week, // for mock test, this will be 0
        score: correctCount,
        accuracy: scorePercentage, // optional: could change later
        userAnswers: {
          createMany: {
            data: userAnswersData,
          },
        },
      },
    })

    return NextResponse.json({ message: "Quiz submitted successfully!", quizRecord })
  } catch (error) {
    console.error("Error in quiz submission:", error)
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 })
  }
}
