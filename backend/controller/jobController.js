const Job = require("../model/jobModel.js");

// ✅ Create a new job
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            keywords,
            location,
            jobType,
            salaryRange
        } = req.body;

        // Basic validation (you can also use a middleware like Joi)
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required." });
        }

        const newJob = new Job({
            title,
            description,
            keywords,
            location,
            jobType,
            salaryRange
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all active jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: "Job not found" });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Admin: Toggle job visibility
exports.toggleJobStatus = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: "Job not found" });

        job.isActive = !job.isActive;
        await job.save();
        res.status(200).json({ message: `Job ${job.isActive ? "activated" : "deactivated"}.`, job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
