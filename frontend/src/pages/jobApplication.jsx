// JobApplication.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CloudUpload } from "lucide-react";

function JobApplication() {
  const { jobId } = useParams();
  const [resume, setResume] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please select a resume file.");
      return;
    }
    const formData = new FormData();
    formData.set("resume", resume);
    formData.set("jobId", jobId);

    try {
      const token = localStorage.getItem("token");
      console.log({ formData });

      await axios.post("http://localhost:8000/application", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to submit application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Apply for Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Resume
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {resume ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">{resume.name}</p>
                    <p className="text-xs text-gray-400">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUpload className="text-gray-500" size={40} />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF or Word (MAX. 5MB)
                    </p>
                  </div>
                )}
                <input
                  id="resume-upload"
                  type="file"
                  name="resume"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobApplication;
