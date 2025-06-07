import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Sorting states
    const [sortBy, setSortBy] = useState('appliedAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Filtering states
    const [selectedJob, setSelectedJob] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [scoreFilter, setScoreFilter] = useState('all');

    // Mock jobs data - replace with actual API call

    const fetchJobs = async () => {
        try {
            // Replace with actual API call
            const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/jobs`);
            setJobs(res.data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    };

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/admin/shortlisted`);
            setApplicants(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
            setLoading(false);
        }
    };

    const handleMail = async (name, email) => {
        try {
            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/admin/send-mail`, { name, email });
            alert("Mail sent to " + name);
        } catch (error) {
            console.error("Failed to send mail:", error);
            alert("Failed to send mail to " + name);
        }
    };

    const deleteApplicant = async (id) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/admin/${id}`);
            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to delete applicant");
        }
    };

    const openModal = (applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApplicant(null);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "text-purple-300 bg-purple-900/50";
        if (score >= 80) return "text-purple-200 bg-purple-800/50";
        if (score >= 70) return "text-purple-100 bg-purple-700/50";
        return "text-gray-300 bg-gray-700/50";
    };

    // Sorting function
    const sortApplicants = (applicants, sortBy, sortOrder) => {
        return [...applicants].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'appliedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    };

    // Filtering function
    const filterApplicants = (applicants) => {
        let filtered = [...applicants];

        // Filter by job
        if (selectedJob !== 'all') {
            filtered = filtered.filter(app => app.jobId === selectedJob);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.phone.includes(searchQuery)
            );
        }

        // Filter by score range
        if (scoreFilter !== 'all') {
            const [min, max] = scoreFilter.split('-').map(Number);
            filtered = filtered.filter(app => {
                if (max) {
                    return app.atsScore >= min && app.atsScore <= max;
                } else {
                    return app.atsScore >= min;
                }
            });
        }

        return filtered;
    };

    // Handle sorting
    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newOrder);
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplicants.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Update filtered applicants when filters change
    useEffect(() => {
        const filtered = filterApplicants(applicants);
        const sorted = sortApplicants(filtered, sortBy, sortOrder);
        setFilteredApplicants(sorted);
        setCurrentPage(1); // Reset to first page when filters change
    }, [applicants, selectedJob, searchQuery, scoreFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchApplicants();
        fetchJobs();
    }, []);

    const SortIcon = ({ field }) => {
        if (sortBy !== field) return <span className="text-gray-500">↕</span>;
        return sortOrder === 'asc' ? <span className="text-purple-400">↑</span> : <span className="text-purple-400">↓</span>;
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Manage shortlisted candidates and send interview invitations
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-purple-900/30 border border-purple-700 rounded-lg px-4 py-3">
                        <span className="text-purple-300 font-semibold">Total: </span>
                        <span className="text-white text-xl">{applicants.length}</span>
                    </div>
                    {/* <div className="bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-3">
                        <span className="text-blue-300 font-semibold">Filtered: </span>
                        <span className="text-white text-xl">{filteredApplicants.length}</span>
                    </div>
                    <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
                        <span className="text-green-300 font-semibold">High Score (90+): </span>
                        <span className="text-white text-xl">{applicants.filter(app => app.atsScore >= 90).length}</span>
                    </div> */}
                    <button
                        onClick={fetchApplicants}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Job Filter Buttons */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">Filter by Job Position:</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedJob('all')}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${selectedJob === 'all'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            All Jobs ({applicants.length})
                        </button>
                        {jobs.map(job => (
                            <button
                                key={job._id}
                                onClick={() => setSelectedJob(job._id)}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${selectedJob === job._id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {job.title} ({applicants.filter(app => app.jobId === job._id).length})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Score Filter */}
                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">ATS Score Range</label>
                            <select
                                value={scoreFilter}
                                onChange={(e) => setScoreFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                            >
                                <option value="all">All Scores</option>
                                <option value="90-100">90-100 (Excellent)</option>
                                <option value="80-89">80-89 (Good)</option>
                                <option value="70-79">70-79 (Average)</option>
                                <option value="0-69">Below 70</option>
                            </select>
                        </div>

                        {/* Items per page */}
                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-2">Items per page</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setScoreFilter('all');
                                    setSelectedJob('all');
                                    setSortBy('appliedAt');
                                    setSortOrder('desc');
                                }}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        <span className="ml-4 text-purple-300">Loading candidates...</span>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-slide-up">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-purple-900/50">
                                        <tr>
                                            <th
                                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider cursor-pointer hover:bg-purple-800/50 transition-colors"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Name <SortIcon field="name" />
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider cursor-pointer hover:bg-purple-800/50 transition-colors"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Email <SortIcon field="email" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Phone</th>
                                            <th
                                                className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider cursor-pointer hover:bg-purple-800/50 transition-colors"
                                                onClick={() => handleSort('atsScore')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    ATS Score <SortIcon field="atsScore" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Job</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Resume</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {currentItems.map((app, i) => {
                                            const jobTitle = jobs.find(job => job._id === app.jobId)?.title || 'Unknown Job';
                                            return (
                                                <tr
                                                    key={app.id || i}
                                                    className="hover:bg-gray-800/50 transition-all duration-300 animate-fade-in"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-white">{app.name}</div>
                                                        <div className="text-sm text-gray-400">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{app.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{app.phone}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(app.atsScore)}`}>
                                                            {app.atsScore}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm">
                                                            {jobTitle}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a
                                                            href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.resumeLink)}&embedded=true`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline"
                                                        >
                                                            View Resume
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleMail(app.name, app.email)}
                                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                                            >
                                                                Send Mail
                                                            </button>
                                                            <button
                                                                onClick={() => openModal(app)}
                                                                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                                            >
                                                                Details
                                                            </button>
                                                            <button
                                                                onClick={() => deleteApplicant(app._id)}
                                                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {currentItems.map((app, i) => {
                                const jobTitle = jobs.find(job => job._id === app.jobId)?.title || 'Unknown Job';
                                return (
                                    <div
                                        key={app.id || i}
                                        className="bg-gray-900 rounded-xl border border-gray-700 p-6 transform transition-all duration-300 hover:scale-105 animate-fade-in"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                                                <p className="text-gray-400 text-sm">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                <span className="inline-block mt-1 px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">
                                                    {jobTitle}
                                                </span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(app.atsScore)}`}>
                                                {app.atsScore}%
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-300">
                                                <span className="text-purple-400 font-medium w-16">Email:</span>
                                                <span className="text-sm">{app.email}</span>
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <span className="text-purple-400 font-medium w-16">Phone:</span>
                                                <span className="text-sm">{app.phone}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <a
                                                href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.resumeLink)}&embedded=true`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-center transition-all duration-300 transform hover:scale-105"
                                            >
                                                View Resume
                                            </a>
                                            <button
                                                onClick={() => handleMail(app.name, app.email)}
                                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                            >
                                                Send Mail
                                            </button>
                                            <button
                                                onClick={() => openModal(app)}
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => deleteApplicant(app._id)}
                                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages).keys()].map(number => (
                                    <button
                                        key={number + 1}
                                        onClick={() => paginate(number + 1)}
                                        className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${currentPage === number + 1
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Results info */}
                        <div className="mt-4 text-center text-gray-400">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplicants.length)} of {filteredApplicants.length} results
                        </div>
                    </>
                )}

                {/* Modal */}
                {isModalOpen && selectedApplicant && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 transform transition-all duration-300 animate-scale-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Candidate Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-purple-400 font-medium">Name: </span>
                                    <span className="text-white">{selectedApplicant.name}</span>
                                </div>
                                <div>
                                    <span className="text-purple-400 font-medium">Email: </span>
                                    <span className="text-gray-300">{selectedApplicant.email}</span>
                                </div>
                                <div>
                                    <span className="text-purple-400 font-medium">Phone: </span>
                                    <span className="text-gray-300">{selectedApplicant.phone}</span>
                                </div>
                                <div>
                                    <span className="text-purple-400 font-medium">Job Applied: </span>
                                    <span className="text-gray-300">
                                        {jobs.find(job => job._id === selectedApplicant.jobId)?.title || 'Unknown Job'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-400 font-medium">ATS Score: </span>
                                    <span className={`px-2 py-1 rounded text-sm ${getScoreColor(selectedApplicant.atsScore)}`}>
                                        {selectedApplicant.atsScore}%
                                    </span>
                                </div>
                                {selectedApplicant.relevanceExplanation && (
                                    <div>
                                        <span className="text-purple-400 font-medium">Relevance Explanation: </span>
                                        <span className="text-gray-300 text-sm">{selectedApplicant.relevanceExplanation}</span>
                                    </div>
                                )}
                                {selectedApplicant.linkedin && (
                                    <div>
                                        <span className="text-purple-400 font-medium">LinkedIn: </span>
                                        <a href={selectedApplicant.linkedin} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                                            View Profile
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <span className="text-purple-400 font-medium">Applied Date: </span>
                                    <span className="text-gray-300">{new Date(selectedApplicant.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => handleMail(selectedApplicant.name, selectedApplicant.email)}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                    Send Mail
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;