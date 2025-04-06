import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;
  try {
    const bookmarks = await prisma.bookmarkedQuestion.findMany({
      where: { userId: Number(userId) },
    });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
}
