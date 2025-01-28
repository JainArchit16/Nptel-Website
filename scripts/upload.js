const fs = require('fs/promises');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importQuizData() {
    try {
        const filePath = path.join(process.cwd(), 'extracted_data/quiz_data.json'); // Path to the JSON file 
        const data = await fs.readFile(filePath, 'utf-8'); // Read the file
        const quizData = JSON.parse(data); // Parse the JSON data

        for (const question of quizData) {
            // Check if the subject exists, if not, create it
            let subject = await prisma.subject.findUnique({
                where: { name: question.subject },
            });

            if (!subject) {
                subject = await prisma.subject.create({
                    data: {
                        name: question.subject,
                    },
                });
            }

            // Create the question and link it to the subject
            await prisma.question.create({
                data: {
                    week: question.week,
                    questionText: question.questionText,
                    options: question.options,
                    correctOption: question.correctOption,
                    subject: {
                        connect: { subjectId: subject.subjectId },
                    },
                },
            });
        }

        console.log('Quiz data imported successfully!');
    } catch (error) {
        console.error('Error importing quiz data:', error);
    } finally {
        await prisma.$disconnect(); // Disconnect from the database
    }
}

importQuizData();
