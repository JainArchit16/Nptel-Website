import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const questions = await request.json();

    if (!Array.isArray(questions)) {
      return new Response(
        JSON.stringify({
          message: "Request body must be an array of questions",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate all questions first
    for (const q of questions) {
      if (
        !q.subject ||
        typeof q.week === "undefined" ||
        !q.questionText ||
        !Array.isArray(q.options) ||
        typeof q.correctOption === "undefined"
      ) {
        return new Response(
          JSON.stringify({ message: "Invalid question structure" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Process subjects and questions in transaction
    const result = await prisma.$transaction(async (tx) => {
      const subjects = [...new Set(questions.map((q) => q.subject))];

      const subjectMap = new Map();
      for (const name of subjects) {
        const subject = await tx.subject.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        subjectMap.set(name, subject.subjectId);
      }

      const createdQuestions = await Promise.all(
        questions.map((q) =>
          tx.question.create({
            data: {
              week: parseInt(q.week, 10),
              questionText: q.questionText,
              options: q.options,
              correctOption: q.correctOption,
              subjectId: subjectMap.get(q.subject),
            },
          })
        )
      );

      return { count: createdQuestions.length };
    });

    return new Response(
      JSON.stringify({
        message: `Upload successful! Processed ${result.count} questions`,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({
        message: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
