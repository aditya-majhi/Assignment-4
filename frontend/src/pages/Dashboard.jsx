// RecruiterDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/applications/candidate", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen w-full px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Total Applications
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {applications.length}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {applications.filter((app) => app.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Reviewed</h3>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter((app) => app.status === "Reviewed").length}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            My Job Applications
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Job Title</th>
              <th className="py-3 px-6 text-left">Company</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {applications.map((application) =>
              application?.job === null ? null : (
                <tr
                  key={application._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {application?.job?.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <span>{application?.job?.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        application?.job?.status === "closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {application?.job?.status}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
