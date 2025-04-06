import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    console.log("Correct API called")
    const { subjectId, week, answers, userId } = await req.json()

    // Basic validation
    if (!subjectId || !answers || !userId) {
      return NextResponse.json({ message: "Missing required fields in the request body." }, { status: 400 })
    }

    // Get all question IDs from the submitted answers
    const questionIds = answers.map((ans) => ans.questionId)

    // Fetch all questions from the DB at once
    const questions = await prisma.question.findMany({
      where: { questionId: { in: questionIds } },
    })

    // Build a map for quick lookup by questionId
    const questionMap = {}
    questions.forEach((q) => {
      questionMap[q.questionId] = q
    })

    let correctCount = 0

    // Build the array of user answers to be stored
    const userAnswersData = answers.map((ans) => {
      const question = questionMap[ans.questionId]

      if (!question) {
        throw new Error(`Question not found for questionId: ${ans.questionId}`)
      }

      // Determine the correct answer using the question's options and correctOption index
      const correctAnswer = question.options[question.correctOption]
      const isCorrect = ans.selectedOption === correctAnswer

      if (isCorrect) {
        correctCount++
      }

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      }
    })

    const totalQuestions = answers.length
    const scorePercentage = (correctCount / totalQuestions) * 100

    // Create the quiz record and the related user answers in one nested write
    const quizRecord = await prisma.quiz.create({
      data: {
        userId,
        subjectId,
        week, // for mock test, this will be 0
        score: scorePercentage,
        accuracy: parseFloat(((scorePercentage / totalQuestions)*100).toFixed(2)),
        userAnswers: {
          create: userAnswersData,
        },
      },
      include: {
        userAnswers: true,
      },
    })

    return NextResponse.json(quizRecord)
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ message: "Error submitting quiz", error: error.message }, { status: 500 })
  }
}

