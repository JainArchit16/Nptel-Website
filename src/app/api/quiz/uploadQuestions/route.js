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
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    // Upsert subjects and map to IDs
    const subjects = [...new Set(questions.map((q) => q.subject))];
    const subjectMap = new Map();

    for (const name of subjects) {
      const subject = await prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      subjectMap.set(name, subject.subjectId);
    }

    // Helper to process in batches
    const batchSize = 5;
    let totalInserted = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);

      await Promise.all(
        batch.map((q) =>
          prisma.question.create({
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

      totalInserted += batch.length;
    }

    return new Response(
      JSON.stringify({
        message: `Upload successful! Processed ${totalInserted} questions`,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
