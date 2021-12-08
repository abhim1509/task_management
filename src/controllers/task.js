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
    console.log("body", body);
    if (!body || data_sanitisation.isObjectOrArrayEmpty(body) || !userId) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("Request body/user is is not appropriate.");
    }

    const getUser = await db_wrapper.getRecord(modelUser, { _id: userId });

    if (!getUser || !getUser.resultSet || !getUser.resultSet._id) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("An error while retrieving user information.");
    }

    body.createdBy = getUser.resultSet._id;
    const task = await db_wrapper.createSingleRecord(modelTask, body);

    if (!task || !task.resultSet) {
      res.status(HTTP_BAD_REQUEST).send("An error while creating task.");
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
      res.status(HTTP_BAD_REQUEST).send("Appropriate parameters are missing.");
    }

    const task = await db_wrapper.getRecord(modelTask, taskId);

    if (!task || !task.resultSet) {
      res.status(HTTP_BAD_REQUEST).send("An error while fetching task.");
    }
    res.status(HTTP_SUCCESS_RETRIEVED).send(task);
  } catch (e) {
    //console.log(e);
    res.status(HTTP_BAD_REQUEST).send(e);
  }
};

router.getTasksList = async function getTasksList(req, res) {
  try {
    console.log(req.params.userId);
    const userId = req.params.userId;
    if (!req.params || !userId) {
      res.status(HTTP_BAD_REQUEST).send("Missing parameter.");
    }

    const sort = {
      priority: 1,
    };

    const taskList = await db_wrapper.getRecords(
      modelTask,
      {
        createdBy: userId,
      },
      sort
    );

    console.log("taskList", taskList);
    if (!taskList || !taskList.resultSet) {
      return res.status(HTTP_STATUS_NOT_FOUND).send("No records found.");
    }

    res.status(HTTP_SUCCESS_RETRIEVED).send(taskList);
  } catch (e) {
    res.status(HTTP_BAD_REQUEST).send(e);
  }
};

router.editSpecificTask = async function editSpecificTask(req, res) {
  try {
    let body = req.body;
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    if (!body || data_sanitisation.isObjectOrArrayEmpty(body) || !userId) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("Request body/user is is not appropriate.");
    }

    const getUser = await db_wrapper.getRecord(modelUser, {
      _id: userId,
    });
    console.log(getUser);
    if (!getUser || !getUser.resultSet || !getUser.resultSet._id) {
      res
        .status(HTTP_BAD_REQUEST)
        .send("An error while retrieving user information.");
    }
    console.log("taskId", taskId);
    console.log("getUser.resultSet._id", getUser.resultSet._id);
    const task = await db_wrapper.updateRecord(
      modelTask,
      { _id: taskId, createdBy: getUser.resultSet._id },
      body
    );

    if (!task || !task.resultSet) {
      res.status(HTTP_BAD_REQUEST).send("An error while creating task.");
    }

    res.status(HTTP_SUCCESS_RETRIEVED).send(task);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

router.deleteTask = async function deleteTask(req, res) {
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
