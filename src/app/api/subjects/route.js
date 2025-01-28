const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
export async function GET(req, res) {
  try {
    const subjects = await prisma.subject.findMany();
    return new Response(JSON.stringify(subjects), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins
      },
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

