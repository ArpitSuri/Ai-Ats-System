// // controllers/applyController.js
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const Applicant = require("../model/applicantModel.js");
// const Job = require("../model/jobModel.js");
// const checkRelevance = require("../utils/gptRevelanceCheck.js");
// const scoreATS = require("../utils/atsScoreCheck.js");
// const uploadToCloudinary = require("../utils/cluodinaryUpload.js");

// exports.handleApplication = async (req, res) => {
//     try {
//         const { jobId, name, email, phone, linkedin, coverLetter } = req.body;
//         const resumePath = req.file.path;

//         // Fetch job details from DB
//         const job = await Job.findById(jobId);
//         if (!job) {
//             fs.unlinkSync(resumePath);
//             return res.status(404).json({ message: "Job not found" });
//         }

//         const resumeBuffer = fs.readFileSync(resumePath);
//         const parsedData = await pdfParse(resumeBuffer);
//         const resumeText = parsedData.text;

//         // GPT Relevance Check using the job description
//         const relevance = await checkRelevance(resumeText, coverLetter, job.description);

//         if (!relevance.isRelevant) {
//             fs.unlinkSync(resumePath);
//             return res.status(200).json({ message: "Not relevant to JD" });
//         }

//         // ATS Scoring using job keywords
//         const atsScore = scoreATS(resumeText, job.keywords);

//         // Upload resume to Cloudinary
//         const resumeLink = await uploadToCloudinary(resumePath);

//         // Save applicant data
//         const newApplicant = new Applicant({
//             jobId,
//             name,
//             email,
//             phone,
//             linkedin,
//             coverLetter,
//             resumeLink,
//             atsScore,
//             relevanceExplanation: relevance.explanation,
//             isRelevant: true,
//         });

//         await newApplicant.save();
//         fs.unlinkSync(resumePath);
//         res.status(201).json({ message: "Application successful" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// };


// 

const pdfParse = require("pdf-parse");
const Applicant = require("../model/applicantModel.js");
const Job = require("../model/jobModel.js");
const checkRelevance = require("../utils/gptRevelanceCheck.js");
const scoreATS = require("../utils/atsScoreCheck.js");
const uploadToCloudinary = require("../utils/cluodinaryUpload.js"); // updated import

exports.handleApplication = async (req, res) => {
    try {
        const { jobId, name, email, phone, linkedin, coverLetter } = req.body;

        // Validate job existence
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Parse resume text from PDF buffer
        const parsedData = await pdfParse(req.file.buffer);
        const resumeText = parsedData.text;

        // GPT Relevance Check
        const relevance = await checkRelevance(resumeText, coverLetter, job.description);
        if (!relevance.isRelevant) {
            return res.status(200).json({ message: "Not relevant to JD" });
        }

        // ATS Score
        const atsScore = scoreATS(resumeText, job.keywords);

        // Upload buffer to Cloudinary
        const resumeLink = await uploadToCloudinary(req.file.buffer, "resumes");

        // Save to MongoDB
        const newApplicant = new Applicant({
            jobId,
            name,
            email,
            phone,
            linkedin,
            coverLetter,
            resumeLink,
            atsScore,
            relevanceExplanation: relevance.explanation,
            isRelevant: true,
            appliedAt: new Date(),
        });

        await newApplicant.save();

        res.status(201).json({ message: "Application successful", resumeLink });
    } catch (error) {
        console.error("Error in handleApplication:", error);
        res.status(500).json({ error: "Server error" });
    }
};
