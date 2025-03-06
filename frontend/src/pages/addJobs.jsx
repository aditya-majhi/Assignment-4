// AddJob.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState({ min: 0, max: 0 });
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleAddJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/jobs",
        { title, description, status: "open", company, salary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job added successfully!");
      navigate("/recruiter-dashboard");
    } catch (err) {
      alert("Failed to add job. Please Try Again");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Post a New Job
        </h2>
        <form onSubmit={handleAddJob} className="space-y-6 text-black">
          {/* Job Basics */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="salary.min"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Minimum Salary ($)
              </label>
              <input
                type="number"
                id="salary.min"
                name="salary.min"
                value={salary.min}
                onChange={(e) => setSalary({ ...salary, min: e.target.value })}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="salary.max"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Salary ($)
              </label>
              <input
                type="number"
                id="salary.max"
                name="salary.max"
                value={salary.max}
                onChange={(e) => setSalary({ ...salary, max: e.target.value })}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Description and Requirements */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
