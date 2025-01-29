import { PrismaClient } from "@prisma/client";
import pdfplumber from "pdfplumber";
import fs from "fs";
import { IncomingForm } from "formidable";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const form = new IncomingForm();
  form.uploadDir = "./uploads"; // Directory to temporarily store uploaded files
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const { week, subjectId, newSubjectName } = fields;
    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      let subject;

      // If a new subject is provided, create it
      if (newSubjectName) {
        subject = await prisma.subject.create({
          data: {
            name: newSubjectName,
          },
        });
      } else {
        // Use the existing subject
        subject = await prisma.subject.findUnique({
          where: { subjectId: parseInt(subjectId) },
        });
      }

      if (!subject) {
        return res.status(400).json({ error: "Invalid subject" });
      }

      // Process the PDF and extract questions
      const quizData = await extractQuestionsAnswers(
        file.filepath,
        parseInt(week),
        subject.subjectId
      );

      // Save questions to the database
      await prisma.question.createMany({
        data: quizData,
      });

      // Clean up the uploaded file
      fs.unlinkSync(file.filepath);

      res.status(200).json({ message: "Upload successful", data: quizData });
    } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ error: "Failed to process PDF" });
    }
  });
}

async function extractQuestionsAnswers(pdfPath, week, subjectId) {
  const quizData = [];
  let multiLineQuestion = "";

  const pdf = await pdfplumber.open(pdfPath);
  for (const page of pdf.pages) {
    const text = page.extract_text();
    if (!text) continue;

    const lines = text.split("\n");

    const questionPattern = /^\d+\)/;
    const optionPattern = /^[A-E]\./;
    const correctPattern = /^Ans\.\s([A-E]|True|False)/;

    let question,
      options,
      correctAnswer = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (questionPattern.test(trimmedLine)) {
        if (question && options.length >= 2 && correctAnswer !== null) {
          quizData.push({
            week: week,
            questionText: question.trim(),
            options: options,
            correctOption: correctAnswer,
            subjectId: subjectId,
          });
        }
        multiLineQuestion = trimmedLine;
        question = null;
        options = [];
        correctAnswer = null;
      } else if (
        optionPattern.test(trimmedLine) ||
        trimmedLine === "True" ||
        trimmedLine === "False"
      ) {
        if (multiLineQuestion) {
          question = multiLineQuestion;
          multiLineQuestion = "";
        }
        options.push(trimmedLine);
      } else if (correctPattern.test(trimmedLine)) {
        const correctLetter = correctPattern.exec(trimmedLine)[1];
        correctAnswer =
          correctLetter === "True"
            ? 0
            : correctLetter === "False"
            ? 1
            : correctLetter.charCodeAt(0) - "A".charCodeAt(0);
      } else if (
        multiLineQuestion &&
        trimmedLine &&
        !optionPattern.test(trimmedLine)
      ) {
        multiLineQuestion += " " + trimmedLine;
      }
    }

    if (question && options.length >= 2 && correctAnswer !== null) {
      quizData.push({
        week: week,
        questionText: question.trim(),
        options: options,
        correctOption: correctAnswer,
        subjectId: subjectId,
      });
    }
  }

  return quizData;
}
