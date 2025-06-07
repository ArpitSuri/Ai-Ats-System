// utils/gptRelevanceCheck.js
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function checkRelevance(resumeText, coverLetter, jobDescription) {
    const prompt = `You are a recruiter. Based on the following job description and applicant data, decide if the candidate is relevant. Return YES/NO and an explanation.\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}\n\nCover Letter:\n${coverLetter}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a helpful hiring assistant." },
            { role: "user", content: prompt },
        ],
    });

    const answer = response.choices[0].message.content;
    const isRelevant = /YES/i.test(answer);

    return {
        isRelevant,
        explanation: answer,
    };
};
