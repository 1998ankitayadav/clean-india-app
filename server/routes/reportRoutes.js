const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// CREATE REPORT
router.post("/add", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      latitude,
      longitude,
      image,
    } = req.body;

    const newReport = new Report({
      title,
      description,
      category,
      priority,
      latitude,
      longitude,
      image,
    });

    await newReport.save();

    res.status(201).json({
      message: "Report saved ✔",
      data: newReport,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// GET ALL REPORTS
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE REPORT
router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);

    res.json({
      message: "Report deleted ✔",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// MARK RESOLVED
router.put("/:id", async (req, res) => {
  try {
    const updatedReport =
      await Report.findByIdAndUpdate(
        req.params.id,
        {
          status: "Resolved",
        },
        {
          new: true,
        }
      );

    res.json(updatedReport);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;