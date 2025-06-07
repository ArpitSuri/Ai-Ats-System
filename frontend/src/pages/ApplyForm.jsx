import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationForm = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        jobId: "",
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        coverLetter: "",
        resume: null,
    });
    const [message, setMessage] = useState("");

    // Fetch job list for dropdown
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/jobs`);
                setJobs(res.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();


    }, []);

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/apply`,
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setMessage(res.data.message || "Application submitted successfully");

            // Mock success response
            setMessage("Application submitted successfully!");

            setFormData({
                jobId: "",
                name: "",
                email: "",
                phone: "",
                linkedin: "",
                coverLetter: "",
                resume: null,
            });
        } catch (err) {
            console.error("Error submitting application:", err);
            setMessage("Submission failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        Join Our Team
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Take the next step in your career journey
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
                    {message && (
                        <div className="mb-6 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg">
                            <p className="text-green-400 text-center">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Position
                            </label>
                            <select
                                name="jobId"
                                value={formData.jobId}
                                onChange={handleChange}
                                required
                                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            >
                                <option value="">Select a Position</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone and LinkedIn Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    placeholder="LinkedIn Profile URL"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cover Letter
                            </label>
                            <textarea
                                name="coverLetter"
                                placeholder="Tell us why you're perfect for this role..."
                                value={formData.coverLetter}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all resize-none"
                            />
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Resume / CV
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-white text-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;