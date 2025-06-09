// import { useState } from "react";
// import { Outlet, Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// const AdminLayout = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     const handleLinkClick = () => {
//         // Only close sidebar on small screens
//         if (window.innerWidth < 768) setIsSidebarOpen(false);
//     };

//     const logout = () => {
//         localStorage.removeItem("authToken");
//         window.location.href = "/login";
//     };

//     return (
//         <div className="min-h-screen flex flex-col md:flex-row">
//             {/* Mobile Header */}
//             <div className="md:hidden flex items-center justify-between bg-purple-800 text-white px-4 py-3 shadow-md">
//                 <h2 className="text-xl font-bold">Admin Portal</h2>
//                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//                     {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//             </div>

//             {/* Sidebar */}
//             <aside
//                 className={`bg-purple-800 text-white p-5 space-y-5 shadow-lg w-full md:w-64 md:block ${isSidebarOpen ? "block" : "hidden"
//                     } md:relative fixed md:static top-0 left-0 h-full z-50 md:h-auto`}
//             >
//                 <Link to="/applicants" onClick={handleLinkClick}>
//                     <h2 className="text-2xl font-bold mb-6 border-b border-purple-600 pb-3">Applicants</h2>
//                 </Link>

//                 <nav className="flex flex-col gap-4">
//                     <Link
//                         to="jobs"
//                         onClick={handleLinkClick}
//                         className="flex items-center py-2 px-3 rounded-md hover:bg-purple-700 transition-colors"
//                     >
//                         <span className="mr-2">📅</span> Jobs
//                     </Link>
//                     {/* <Link
//                         to="doctors"
//                         onClick={handleLinkClick}
//                         className="flex items-center py-2 px-3 rounded-md hover:bg-purple-700 transition-colors"
//                     >
//                         <span className="mr-2">👨‍⚕️</span> Doctors
//                     </Link>
//                     <Link
//                         to="departments"
//                         onClick={handleLinkClick}
//                         className="flex items-center py-2 px-3 rounded-md hover:bg-purple-700 transition-colors"
//                     >
//                         <span className="mr-2">🏥</span> Departments
//                     </Link> */}
//                 </nav>

//                 {/* <div className="mt-6 pt-4 border-t border-purple-600">
//                     <Link
//                         to="patientRecord"
//                         onClick={handleLinkClick}
//                         className="bg-white text-purple-800 px-4 py-2 rounded-md font-medium flex items-center justify-center hover:bg-purple-100 transition-colors"
//                     >
//                         <span className="mr-2">👤</span> Patient Records
//                     </Link>
//                 </div> */}

//                 <div className="pt-8">
//                     <button
//                         className="bg-purple-600 hover:bg-purple-500 text-white w-full px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
//                         onClick={logout}
//                     >
//                         <span className="mr-2">🚪</span> Logout
//                     </button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 bg-white p-4 md:p-8 mt-16 md:mt-0">
//                 <div className="bg-purple-50 rounded-lg shadow-sm p-4 md:p-6 min-h-full">
//                     <Outlet />
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminLayout;


import { useState } from "react";
import { Menu, X, Briefcase, LogOut, Users } from "lucide-react";
import { Outlet, Link } from "react-router-dom";

// Mock components for demonstration


const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLinkClick = () => {
        // Only close sidebar on small screens
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-black">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-gradient-to-r from-purple-800 to-purple-700 text-white px-4 py-3 shadow-lg border-b border-purple-600/30">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Admin Portal
                </h2>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg hover:bg-purple-700/50 transition-colors duration-200"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white p-6 space-y-6 shadow-2xl w-full md:w-72 border-r border-purple-500/20 ${isSidebarOpen ? "block" : "hidden"
                    } md:block fixed md:relative top-0 left-0 h-full z-50 md:h-auto backdrop-blur-sm`}
            >
                {/* Logo/Header Section */}
                <div className="mb-8">
                    <Link to="/adminDashboard" onClick={handleLinkClick} className="block group">
                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                            Admin Portal
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
                        <p className="text-gray-400 text-sm mt-3">Manage your job applications</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-3">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-3">
                        Main Menu
                    </div>

                    <Link
                        to="/adminDashboard"
                        onClick={handleLinkClick}
                        className="group flex items-center py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-purple-700/50 transition-all duration-200 border border-transparent hover:border-purple-500/30 backdrop-blur-sm"
                    >
                        <Users size={20} className="mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                        <span className="font-medium group-hover:text-white transition-colors duration-200">Applicants</span>
                        <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Link>

                    <Link
                        to="jobs"
                        onClick={handleLinkClick}
                        className="group flex items-center py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-800/50 hover:to-purple-700/50 transition-all duration-200 border border-transparent hover:border-purple-500/30 backdrop-blur-sm"
                    >
                        <Briefcase size={20} className="mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                        <span className="font-medium group-hover:text-white transition-colors duration-200">Jobs</span>
                        <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Link>
                </nav>

                {/* Stats Section */}
                {/* <div className="bg-gradient-to-r from-purple-900/30 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 mt-8">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Stats</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Active Jobs</span>
                            <span className="text-sm font-medium text-green-400">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Applications</span>
                            <span className="text-sm font-medium text-blue-400">48</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Pending</span>
                            <span className="text-sm font-medium text-yellow-400">7</span>
                        </div>
                    </div>
                </div> */}

                {/* Logout Button */}
                <div className="pt-6 mt-auto">
                    <button
                        className="group w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center border border-red-500/30 hover:border-red-400/50 backdrop-blur-sm transform hover:scale-[1.02] cursor-pointer"
                        onClick={logout}
                    >
                        <LogOut size={18} className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                        Logout
                    </button>
                </div>
            </aside> 

            {/* Main Content */}
            <main className="flex-1 bg-black p-4 md:p-8 mt-16 md:mt-0 min-h-screen">
                <div className="bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl p-6 md:p-8 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
