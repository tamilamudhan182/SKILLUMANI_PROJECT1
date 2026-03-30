const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user.id };

    if (status && status !== "all") {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch tasks.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      status: status === "complete" ? "complete" : "pending",
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create task.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update task.", error: error.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.status = task.status === "complete" ? "pending" : "complete";
    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Unable to toggle task.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete task.", error: error.message });
  }
});

module.exports = router;
