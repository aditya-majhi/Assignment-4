// App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/logIn";
import Register from "./pages/registration";
import JobListings from "./pages/jobListings";
import Dashboard from "./pages/Dashboard";
import ApplyJob from "./pages/jobApplication";
import AddJob from "./pages/addJobs";
import Navbar from "./components/navbar";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AppllicantsPage from "./pages/appllicantsPage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          <Route path="/add" element={<AddJob />} />
          <Route path="/applicants/:id" element={<AppllicantsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
