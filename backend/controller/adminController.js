// controllers/adminController.js
const Applicant = require("../model/applicantModel.js");
const sendMail = require("../utils/sendInterviewMails.js");

exports.getShortlisted = async (req, res) => {
    try {
        const applicants = await Applicant.find({ isRelevant: true }).sort({ atsScore: -1 });
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
};


// exports.getShortlisted = async (req, res) => {
//     try {
//         const applicants = await Applicant.find({ isRelevant: true })
//             .sort({ atsScore: -1 })
//             .populate("jobId", "title"); // Populate only the title from the Job model

//         res.status(200).json(applicants);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch applicants" });
//     }
// };



exports.sendInterviewMail = async (req, res) => {
    try {
        const { name, email } = req.body;
        await sendMail(name, email);
        res.status(200).json({ message: "Mail sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send mail" });
    }
};

exports.deleteApplicant = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedApplicant = await Applicant.findByIdAndDelete(id);

        if (!deletedApplicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        res.status(200).json({ message: "Applicant deleted successfully" });
    } catch (error) {
        console.error("Error deleting applicant:", error);
        res.status(500).json({ error: "Server error" });
    }
};