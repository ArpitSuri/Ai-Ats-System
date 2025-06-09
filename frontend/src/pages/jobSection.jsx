import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const JobSection = () => {
    const [jobs, setJobs] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        keywords: "",
        location: "",
        jobType: "Remote",
        salaryRange: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/jobs/${id}/toggle`);
            setJobs(jobs.map(job =>
                job._id === id ? { ...job, isActive: !job.isActive } : job
            ));
            console.log(`Toggling job status for ID: ${id}`);
        } catch (err) {
            console.error("Error toggling job status:", err);
        }
    };

    const handleCreateJob = async () => {
        if (!formData.title || !formData.description) return;

        setIsSubmitting(true);

        try {
            const jobPayload = {
                ...formData,
                keywords: formData.keywords.split(",").map((k) => k.trim()),
            };

            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/jobs`, jobPayload);

            const newJob = {
                _id: Date.now().toString(),
                ...jobPayload,
                isActive: true
            };
            setJobs([newJob, ...jobs]);

            setFormData({
                title: "",
                description: "",
                keywords: "",
                location: "",
                jobType: "Remote",
                salaryRange: "",
            });

            console.log("Job created:", jobPayload);
            toast.success("Job created successfully!");
        } catch (err) {
            console.error("Error creating job:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                        Job Management
                    </h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Create and manage job postings for your organization
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 rounded-lg">
                            <span className="text-white font-medium">Total Jobs: {jobs.length}</span>
                        </div>
                        <button
                            onClick={fetchJobs}
                            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Job Creation Form */}
                <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Create New Job</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Job Title"
                                className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Job Description"
                                className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 resize-none"
                                rows={4}
                                required
                            />
                        </div>

                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="Keywords (comma-separated)"
                            className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                        />

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                        />

                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                            required
                        >
                            <option value="Remote">Remote</option>
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>

                        <input
                            type="text"
                            name="salaryRange"
                            value={formData.salaryRange}
                            onChange={handleChange}
                            placeholder="Salary Range"
                            className="w-full p-4 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                        />

                        <div className="lg:col-span-2">
                            <button
                                type="button"
                                onClick={handleCreateJob}
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                                        Creating Job...
                                    </div>
                                ) : (
                                    "Create Job"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-800/50 to-purple-700/50">
                                <tr>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider">Title</th>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider hidden sm:table-cell">Location</th>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider hidden md:table-cell">Type</th>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider hidden lg:table-cell">Salary</th>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider">Status</th>
                                    <th className="text-left p-4 text-gray-200 font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {jobs.map((job, index) => (
                                    <tr
                                        key={job._id}
                                        className="hover:bg-purple-900/20 transition-colors duration-200"
                                        style={{
                                            opacity: 0,
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                                        }}
                                    >
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white font-medium text-lg">{job.title}</div>
                                                <div className="text-gray-400 text-sm mt-1 sm:hidden">
                                                    {job.location} • {job.jobType}
                                                </div>
                                                <div className="text-gray-300 text-sm mt-2 line-clamp-2">
                                                    {job.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300 hidden sm:table-cell">{job.location}</td>
                                        <td className="p-4 text-gray-300 hidden md:table-cell">{job.jobType}</td>
                                        <td className="p-4 text-gray-300 hidden lg:table-cell">{job.salaryRange}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${job.isActive
                                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                }`}>
                                                {job.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(job._id)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${job.isActive
                                                            ? "bg-red-600/80 hover:bg-red-600 text-white"
                                                            : "bg-green-600/80 hover:bg-green-600 text-white"
                                                        }`}
                                                >
                                                    {job.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    className="bg-gray-600/80 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {jobs.length === 0 && (
                    <div className="text-center py-12 bg-gradient-to-br from-purple-900/30 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl mt-8">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 border-2 border-purple-400 border-dashed rounded-full"></div>
                        </div>
                        <p className="text-gray-400 text-lg">No jobs available. Create your first job!</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default JobSection;