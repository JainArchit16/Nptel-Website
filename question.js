const fs = require('fs/promises');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
// import path from 'path';
// import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importQuizData() {
    const filePath = path.join(process.cwd(), 'quiz_data.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const quizData = JSON.parse(data);

    for (const question of quizData) {
        await prisma.question.create({
            data: {
                week: question.week,
                questionText: question.questionText,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD,
                correctOption: question.correctOption,
            },
        });
    }

    console.log('Data imported successfully!');
}

importQuizData().catch((error) => console.error(error));
