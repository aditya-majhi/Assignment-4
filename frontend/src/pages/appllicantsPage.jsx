import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AppllicantsPage = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log({ id });
    axios
      .get(`http://localhost:8000/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApplicants(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log({ applicants });
  }, [applicants]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back to Jobs
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Applicants</p>
              <p className="font-medium text-gray-800">{applicants.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Applicants
                  </h2>
                </div>
              </div>

              {/* Applicants List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Experience
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="p-3">
                          <div className="font-medium text-gray-900">
                            {applicant?.parsedFields?.name}
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">
                          {applicant?.parsedFields?.experience}
                        </td>
                        <td className="p-3 text-gray-700">
                          {applicant?.candidate?.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppllicantsPage;
