import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/quizzes/user/:userId
export const GET = async (request, { params }) => {
  try {
    const { userId } = params;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    // Fetch quizzes for the specific user
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: parseInt(userId), // Convert userId to integer if it's a string
      },
      include: {
        user: true, // Include related user details if needed
        subject: true, // Include related subject details if needed
        userAnswers: true, // Include user answers if needed
      },
    });

    return new Response(JSON.stringify(quizzes), { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return new Response("Something Went Wrong", { status: 500 });
  }
};
