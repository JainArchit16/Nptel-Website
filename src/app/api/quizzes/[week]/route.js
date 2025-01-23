import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { week } = params;

  // Ensure week is a valid integer
  const weekNumber = parseInt(week);
  if (isNaN(weekNumber)) {
    return new Response(
      JSON.stringify({ error: 'Invalid week number' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch questions for the given week from the database
    const questions = await prisma.question.findMany({
      where: { week: weekNumber },
      select: {
        questionId: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
      },
    });

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No questions found for this week' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the questions as a JSON response
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
