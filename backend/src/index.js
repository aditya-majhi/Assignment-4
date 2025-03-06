// server.js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const upload = require("./middleware/multer.middleware.js");
const { User } = require("./models/users.model.js");
const { Job } = require("./models/jobs.model.js");
const { Application } = require("./models/application.model.js");
const { authenticateToken } = require("./middleware/auth.middleware.js");
const { requireRecruiter } = require("./middleware/role.middleware.js");

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

//Mongo DB connection
const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// ---- Auth Endpoints ----
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /auth/login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Recruiters Only Job Endpoints ----

//Create a new job posting
app.post("/jobs", authenticateToken, requireRecruiter, async (req, res) => {
  try {
    const { title, company, salary, description, status } = req.body;

    console.log({
      title,
      description,
      status,
      recruiter: req.user.id,
      company,
      salary,
    });

    const newJob = new Job({
      title,
      description,
      status,
      company,
      salary,
      recruiter: req.user.id,
    });
    await newJob.save();
    res.json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//To get all the job posts by the recruiter
app.get(
  "/jobs/recruiter",
  authenticateToken,
  requireRecruiter,
  async (req, res) => {
    try {
      const recruiterJobs = await Job.find({ recruiter: req.user.id });
      res.json(recruiterJobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching recruiter jobs" });
    }
  }
);

//Get the Applicants to a specific job post
app.get(
  "/jobs/:jobId/applicants",
  authenticateToken,
  requireRecruiter,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await Job.findOne({ _id: jobId, recruiter: req.user.id });
      if (!job) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      }
      const applicants = await Application.find({ job: jobId })
        .populate("candidate", "email")
        .populate("job", "title");
      res.json(applicants);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching applicants" });
    }
  }
);

//List all jobs
app.get("/getjobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "email role");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Update a job posting
app.patch(
  "/jobs/:id",
  authenticateToken,
  requireRecruiter,
  async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        recruiter: req.user.id,
      });
      console.log({ job });

      if (!job)
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      const { title, description, status, salary } = req.body;
      job.title = title || job.title;
      job.description = description || job.description;
      job.salary = salary || job.salary;
      job.status = status || job.status;
      await job.save();
      res.json(job);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//Delete a job posting
app.delete(
  "/jobs/:id",
  authenticateToken,
  requireRecruiter,
  async (req, res) => {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.id,
        recruiter: req.user.id,
      });
      console.log({ req: req.params.id, recruiter: req.user.id });
      console.log({ job });

      if (!job)
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ---- Resume Parsing & Application Submission ----

//Mock Data after parsing resume
function parseResume(filePath) {
  return {
    name: "John Doe",
    skills: ["JavaScript", "Node.js", "React"],
    experience: "3 years",
  };
}

//Candidates apply by uploading a resume
app.post(
  "/application",
  authenticateToken,
  upload.single("resume"),
  async (req, res) => {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }
    try {
      const { jobId } = req.body;
      const resumeUrl = req.file ? req.file.path : null;
      console.log({ jobId, resumeUrl });

      if (!resumeUrl)
        return res.status(400).json({ message: "Resume file is required" });

      const parsedFields = parseResume(resumeUrl);

      const newApplication = new Application({
        candidate: req.user.id,
        job: jobId,
        resumeUrl,
        parsedFields,
      });

      console.log({ newApplication });

      await newApplication.save();
      res.json(newApplication);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//Candidates view their own applications
app.get("/applications/candidate", authenticateToken, async (req, res) => {
  if (req.user.role !== "candidate") {
    return res
      .status(403)
      .json({ message: "Only candidates can view their applications" });
  }
  try {
    let applications = await Application.find({
      candidate: req.user.id,
    }).populate("job", "title description status company");

    applications = applications.filter((app) => app.job !== null);

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
