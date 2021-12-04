const express = require("express");
const router = new express.Router();
const taskController = require("./../controllers/task");

const { verifyToken } = require("./../middlewares/auth");

router.post("/users/:userId/tasks", verifyToken, taskController.createTask);
router.get("/users/:userId/tasks", verifyToken, taskController.getTasksList);
router.get(
  "/users/:userId/tasks/:taskId",
  verifyToken,
  taskController.getSpecificTask
);
router.delete(
  "/users/:userId/tasks/:taskId",
  verifyToken,
  taskController.deleteTask
);

module.exports = router;
