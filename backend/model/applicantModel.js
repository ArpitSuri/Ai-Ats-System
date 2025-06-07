// // models/Applicant.js
// const mongoose = require("mongoose");

// const applicantSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     linkedin: String,
//     resumeLink: String,
//     coverLetter: String,
//     atsScore: Number,
//     relevanceExplanation: String,
//     isRelevant: Boolean,
//     date: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Applicant", applicantSchema);


const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    resumeLink: { type: String, required: true },
    coverLetter: { type: String, required: true },
    atsScore: { type: Number },
    relevanceExplanation: { type: String },
    isRelevant: { type: Boolean, default: false },
    appliedAt: { type: Date, default: Date.now } // renamed from "date"
});

module.exports = mongoose.model("Applicant", applicantSchema);
