const mongoose = require("mongoose");
const Job = require("./model/jobModel"); // Adjust path if needed

// Replace with your MongoDB connection string

const jobs = [
    {
        title: "Frontend Developer",
        description: "We are looking for a skilled frontend developer with experience in React and Tailwind CSS.",
        keywords: ["React", "Tailwind", "JavaScript", "Frontend"],
        location: "Bangalore, India",
        jobType: "Hybrid",
        salaryRange: "₹8 LPA - ₹12 LPA",
    },
    {
        title: "Backend Developer",
        description: "Looking for a Node.js backend developer to build scalable APIs.",
        keywords: ["Node.js", "Express", "MongoDB", "Backend"],
        location: "Remote",
        jobType: "Remote",
        salaryRange: "$70k - $90k",
    },
    {
        title: "Full Stack Engineer",
        description: "Join our fast-growing startup as a full stack engineer working on MERN stack.",
        keywords: ["MERN", "JavaScript", "Full Stack", "MongoDB"],
        location: "Delhi, India",
        jobType: "On-site",
        salaryRange: "₹10 LPA - ₹15 LPA",
    },
    {
        title: "Data Scientist",
        description: "Hiring data scientists with strong Python and ML background.",
        keywords: ["Python", "Machine Learning", "Data Analysis", "Pandas"],
        location: "Mumbai, India",
        jobType: "Hybrid",
        salaryRange: "₹15 LPA - ₹22 LPA",
    },
    {
        title: "DevOps Engineer",
        description: "Build and manage CI/CD pipelines and AWS infrastructure.",
        keywords: ["AWS", "Docker", "Kubernetes", "DevOps", "CI/CD"],
        location: "Remote",
        jobType: "Remote",
        salaryRange: "$80k - $110k",
    },
];

async function seedJobs() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");

        await Job.deleteMany({});
        console.log("Old jobs removed");

        await Job.insertMany(jobs);
        console.log("Sample jobs inserted");

        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding jobs:", error);
    }
}

seedJobs();
