// controllers/applyController.js
// const fs = require("fs");
// const path = require("path");
// const pdfParse = require("pdf-parse");
// const Applicant = require("../model/applicantModel.js");
// const checkRelevance = require("../utils/gptRevelanceCheck.js");
// const scoreATS = require("../utils/atsScoreCheck.js");
// const uploadToCloudinary = require("../utils/cluodinaryUpload.js");

// exports.handleApplication = async (req, res) => {
//     try {
//         const { name, email, phone, linkedin, coverLetter } = req.body;
//         const resumePath = req.file.path;

//         const resumeBuffer = fs.readFileSync(resumePath);
//         const parsedData = await pdfParse(resumeBuffer);
//         const resumeText = parsedData.text;

//         // Step 1: GPT Relevance Check
//         const relevance = await checkRelevance(resumeText, coverLetter);

//         if (!relevance.isRelevant) {
//             fs.unlinkSync(resumePath);
//             return res.status(200).json({ message: "Not relevant to JD" });
//         }

//         // Step 2: ATS Scoring
//         const atsScore = await scoreATS(resumeText);

//         // Step 3: Upload to Cloudinary
//         const resumeLink = await uploadToCloudinary(resumePath);

//         // Step 4: Save to DB
//         const newApplicant = new Applicant({
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


// controllers/applyController.js
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Applicant = require("../model/applicantModel.js");
const Job = require("../model/jobModel.js");
const checkRelevance = require("../utils/gptRevelanceCheck.js");
const scoreATS = require("../utils/atsScoreCheck.js");
const uploadToCloudinary = require("../utils/cluodinaryUpload.js");

exports.handleApplication = async (req, res) => {
    try {
        const { jobId, name, email, phone, linkedin, coverLetter } = req.body;
        const resumePath = req.file.path;

        // Fetch job details from DB
        const job = await Job.findById(jobId);
        if (!job) {
            fs.unlinkSync(resumePath);
            return res.status(404).json({ message: "Job not found" });
        }

        const resumeBuffer = fs.readFileSync(resumePath);
        const parsedData = await pdfParse(resumeBuffer);
        const resumeText = parsedData.text;

        // GPT Relevance Check using the job description
        const relevance = await checkRelevance(resumeText, coverLetter, job.description);

        if (!relevance.isRelevant) {
            fs.unlinkSync(resumePath);
            return res.status(200).json({ message: "Not relevant to JD" });
        }

        // ATS Scoring using job keywords
        const atsScore = scoreATS(resumeText, job.keywords);

        // Upload resume to Cloudinary
        const resumeLink = await uploadToCloudinary(resumePath);

        // Save applicant data
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
        });

        await newApplicant.save();
        fs.unlinkSync(resumePath);
        res.status(201).json({ message: "Application successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
