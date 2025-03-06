import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://assignment-4-flff.onrender.com/jobs/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setJobs(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Delete job handler
  const handleDeleteJob = (jobId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`https://assignment-4-flff.onrender.com/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        axios
          .get("https://assignment-4-flff.onrender.com/jobs/recruiter", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setJobs(res.data);
            console.log(res.data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  // Edit job handler
  const handleEditJob = (updatedJob) => {
    setEditingJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Recruiter Dashboard
        </h1>

        {/* Job List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Job Title</th>
                <th className="p-3 text-left">Salary</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.length
                ? jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b hover:bg-gray-50 text-gray-800"
                    >
                      <td className="p-3">{job.title}</td>
                      <td className="p-3">{`${job?.salary?.min} - ${job?.salary?.max}`}</td>
                      <td className="p-3">
                        <span
                          className={`
                        px-2 py-1 rounded text-xs font-semibold
                        ${
                          job?.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                        >
                          {job?.status}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/applicants/${job._id}`)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          Applicants
                        </button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        {/* Edit Job Modal */}
        {editingJob && (
          <EditJobModal job={editingJob} onCancel={() => setEditingJob(null)} />
        )}
      </div>
    </div>
  );
};

// Edit Job Modal Component
const EditJobModal = ({ job, onCancel }) => {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState({ min: 0, max: 0 });
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const handleEditJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `https://assignment-4-flff.onrender.com/jobs/${job._id}`,
        { title, description, status, salary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job added successfully!");
      onCancel();

      axios
        .get("https://assignment-4-flff.onrender.com/jobs/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setJobs(res.data);
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    } catch (err) {
      alert("Failed to add job. Please Try Again");
    }
  };

  return (
    <div className="fixed inset-0 shadow-2xl bg-opacity-100 text-gray-800 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleEditJob}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Job Description</label>
            <input
              type="text"
              rows={4}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
