// App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplyForm from "./pages/ApplyForm";
import JobSection from "./pages/jobSection";
import AdminLayout from "./adminDashboard/AdminLayout";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Login from "./pages/login";
// import ShortlistedApplicants from "./pages/ApplicantList";
import AdminDashboard from "./pages/ApplicantList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ApplyForm/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="adminDashboard" element={<ProtectedRoute allowedRole="admin"> <AdminLayout/> </ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
        <Route path="jobs" element={<JobSection />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
