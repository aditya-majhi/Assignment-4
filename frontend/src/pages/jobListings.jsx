// JobListings.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function JobListings() {
  const [jobs, setJobs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/getjobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log({ jobs });
  }, [jobs]);

  return (
    <div className="min-h-screen bg-gray-100 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Available Jobs
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {job?.title}
            </h2>
            <p className="text-gray-600 mb-1">{job?.company}</p>
            <p className="text-gray-500 mb-3">{job?.location}</p>
            <p className="text-green-600 font-medium mb-3">{`${job?.salary?.min} - ${job?.salary?.max}`}</p>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {job?.description}
            </p>
            <button
              onClick={() => navigate(`/apply/${job._id}`)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobListings;
