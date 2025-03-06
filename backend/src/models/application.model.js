const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  parsedFields: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = { Application };
