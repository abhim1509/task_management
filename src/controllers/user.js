const express = require("express");
const router = new express.Router();
const User = require("../utils/database/models/user");
const db_wrapper = require("./../utils/database/database_wrapper");
const { data_sanitisation } = require("./../utils/utilities");
const {
  HTTP_SUCCESS_CREATION,
  HTTP_SERVER_ERROR,
  HTTP_SUCCESS_RETRIEVED,
  HTTP_UNAUTHORIZED_ERROR,
  HTTP_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = require("../utils/constants/index");

modelUser = User;

router.getSpecificUser = async function getSpecificUser(req, res) {
  try {
    const _id = req.params.userId;

    if (!_id || typeof _id != "string") {
      //throw new Error("User id is not appropriate.");
      //Send response
    }
    const result = await db_wrapper.getRecord(modelUser, _id);
    if (!result.resultSet) {
      return res.status(HTTP_SUCCESS_RETRIEVED).send(result.message);
    }

    res.status(HTTP_SUCCESS_RETRIEVED).send(result);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

router.createUser = async function createUser(req, res) {
  try {
    const body = req.body;
    if (!body || data_sanitisation.isObjectOrArrayEmpty(body)) {
      throw new Error("Request body is not appropriate.");
    }

    const user = await db_wrapper.createSingleRecord(modelUser, body);
    if (!user.resultSet) {
      res.status(HTTP_STATUS_NOT_FOUND).send(user.message);
    }

    res.status(HTTP_SUCCESS_CREATION).send(user);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

module.exports = router;
