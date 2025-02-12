import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = parseInt(searchParams.get("subjectId"));
    if (!subjectId) {
      return new Response(
        JSON.stringify({ error: "Subject ID is required" }),
        { status: 400 }
      );
    }
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 50;

    // Fetch random questions for the selected subject
    const questions = await prisma.$queryRaw`
      SELECT * FROM "Question"
      WHERE "subjectId" = ${subjectId}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    return new Response(JSON.stringify(questions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
