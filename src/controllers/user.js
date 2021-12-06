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

const bcrypt = require("bcryptjs");

modelUser = User;

router.getSpecificUser = async function getSpecificUser(req, res) {
  try {
    const _id = req.params.userId;

    if (!_id || typeof _id != "string") {
      res.status(HTTP_BAD_REQUEST).send("User id is not appropriate.");
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
    console.log("body", body);
    if (!body || !body.email || !body.password) {
      return res
        .status(HTTP_BAD_REQUEST)
        .send(" Request body is not appropriate.");
    }

    //Check if user already exists.
    const result = await db_wrapper.getRecord(modelUser, { email: body.email });
    console.log("result", result);
    if (
      result.resultSet &&
      !data_sanitisation.isObjectOrArrayEmpty(result.resultSet)
    ) {
      return res.status(HTTP_BAD_REQUEST).send(result.message);
    }

    const encryptedPassword = await bcrypt.hash(body.password, 8);
    const userToSave = {
      email: body.email.toLowerCase(),
      password: encryptedPassword,
    };

    const userObj = await db_wrapper.createSingleRecord(modelUser, userToSave);
    const userResult = userObj.resultSet;
    if (!userObj || !userResult) {
      res.status(HTTP_STATUS_NOT_FOUND).send(userObj.message);
    }

    const userResponse = {
      email: userResult.email,
      createdAt: userResult.createdAt,
      userId: userResult._id,
    };
    res.status(HTTP_SUCCESS_CREATION).send(userResponse);
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

module.exports = router;
