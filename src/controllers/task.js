const express = require("express");
const router = new express.Router();
const Task = require("../utils/database/models/task");
const User = require("../utils/database/models/user");
const db_wrapper = require("../utils/database/database_wrapper");
const {
  HTTP_SUCCESS_CREATION,
  HTTP_SERVER_ERROR,
  HTTP_SUCCESS_RETRIEVED,
  HTTP_UNAUTHORIZED_ERROR,
  HTTP_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = require("../utils/constants/index");

const { data_sanitisation } = require("./../utils/utilities");

modelTask = Task;
modelUser = User;

router.createTask = async function createTask(req, res) {
  try {
    let body = req.body;
    const userId = req.params.userId;

    if (!body || data_sanitisation.isObjectOrArrayEmpty(body) || !userId) {
      throw new Error("Request body/user is is not appropriate.");
    }

    getUser = await db_wrapper.getRecord(modelUser, userId);

    if (!getUser || !getUser.resultSet || !getUser.resultSet._id) {
      throw new Error("An error while retrieving user information.");
    }

    body.createdBy = getUser.resultSet._id;
    const task = await db_wrapper.createSingleRecord(modelTask, body);

    if (!task || !task.resultSet) {
      throw new Error("An error while creating task.");
    }

    res.status(HTTP_SUCCESS_CREATION).send(task);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

router.getSpecificTask = async function getSpecificTask(req, res) {
  try {
    const params = req.params;
    const userId = params.userId;
    const taskId = params.taskId;

    if (!params || !userId || !taskId) {
      throw new Error("Appropriate parameters are missing.");
    }

    const task = await db_wrapper.getRecord(modelTask, taskId);

    if (!task || !task.resultSet) {
      throw new Error("An error while fetching task.");
    }
    res.status(HTTP_SUCCESS_RETRIEVED).send(task);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send(e);
  }
};

router.getTasksList = async function getTasksList(req, res) {
  try {
    const userId = req.params.userId;
    if (!req.params || !userId) {
      res.status(HTTP_BAD_REQUEST).send("Missing parameter.");
    }
    let sort = {
      priority: 1,
    };
    const taskList = await db_wrapper.getRecords(modelTask, {
      createdBy: userId,
      options: {
        sort, //sort not working.
      },
    });
    console.log("taskList", taskList);
    if (!taskList || !taskList.resultSet) {
      return res.status(HTTP_STATUS_NOT_FOUND).send("No records found.");
    }

    res.status(HTTP_SUCCESS_RETRIEVED).send(taskList);
  } catch (e) {
    res.status(HTTP_BAD_REQUEST).send(e);
  }
};

router.deleteTask = async function deleteTask(req, res) {
  //console.log(req.params.id);
  try {
    const params = req.params;
    const userId = params.userId;
    const taskId = params.taskId;

    if (!params || !userId || !taskId) {
      res.status(HTTP_BAD_REQUEST).send("Appropriate parameters missing.");
    }

    const task = await db_wrapper.deleteRecord(modelTask, {
      createdBy: userId,
      _id: taskId,
    });

    if (!task || !task.resultSet) {
      return res.status(HTTP_STATUS_NOT_FOUND);
    }

    res.status(HTTP_SUCCESS_RETRIEVED).send(task);
  } catch (e) {
    res.status(HTTP_STATUS_NOT_FOUND).send(e);
  }
};

module.exports = router;
