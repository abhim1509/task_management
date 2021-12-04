const express = require("express");
const router = new express.Router();
const taskController = require("./../controllers/task");

router.post("/users/:userId/tasks", taskController.createTask);
router.get("/users/:userId/tasks", taskController.getTasksList);
router.get("/users/:userId/tasks/:taskId", taskController.getSpecificTask);
router.delete("/users/:userId/tasks/:taskId", taskController.deleteTask);

module.exports = router;
