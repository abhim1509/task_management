const express = require("express");
const router = new express.Router();
const User = require("../utils/database/models/user");
const db_wrapper = require("./../utils/database/database_wrapper");
const userController = require("./../controllers/user");
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
const authMiddleware = require("./../middlewares/auth");
const { updateRecord } = require("../utils/database/database_wrapper");
modelUser = User;

router.registerUser = async function registerUser(req, res) {
  userController.createUser(req, res);
};

router.login = async function login(req, res) {
  try {
    const body = req.body;
    //console.log(body);
    if (!body || !body.email || !body.password) {
      return res
        .status(HTTP_BAD_REQUEST)
        .send(" Request body is not appropriate.");
    }

    //Check if user exists.
    const userObj = await db_wrapper.getRecord(modelUser, {
      email: body.email,
    });

    var userResult = userObj.resultSet;
    //console.log("userResult", userResult);
    //console.log(body.password, userResult.password);

    if (
      userResult.password &&
      (await bcrypt.compare(body.password, userResult.password))
    ) {
      //console.log("inside if - userObj", userObj);
      const { resultSet } = userObj;
      const userId = resultSet._id;
      const email = resultSet.email;
      const token = authMiddleware.createToken(userId, email);

      resultSet.token = token;

      const updatedUserObj = await db_wrapper.updateRecord(
        modelUser,
        {
          email: body.email,
        },
        resultSet
      );
      const userResult = updatedUserObj.resultSet;
      if (!updatedUserObj || !userResult) {
        res.status(HTTP_STATUS_NOT_FOUND).send(updatedUserObj.message);
      }

      const userResponse = {
        email: userResult.email,
        token: userResult.token,
        userId: userResult._id,
      };
      console.log(userResult);
      res.setHeader("authorization", userResult.token);
      res.status(HTTP_SUCCESS_RETRIEVED).send(userResponse);
    }
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

router.logout = async function logout(req, res) {
  try {
    //console.log(req.header("authorization"));
    const auth = req.header("authorization");
    if (!req.body || !auth || !req.body.email) {
      //console.log("req.body", req.body);
      //console.log("auth", auth);
      //console.log("req.body.email", req.body.email);
      return res.status(HTTP_BAD_REQUEST).send(" Request is not appropriate.");
    }

    //Check if user exists.
    const userObj = await db_wrapper.getRecord(modelUser, {
      email: req.body.email,
    });

    if (!userObj) {
      res.status(HTTP_BAD_REQUEST).send("User not found.");
    }
    authMiddleware.expireToken(
      userObj.resultSet.userId,
      userObj.resultSet.email
    );
    const updatedUserObj = await updateRecord(
      modelUser,
      {
        email: userObj.resultSet.email,
      },
      userObj.resultSet
    );

    res.status(HTTP_SUCCESS_RETRIEVED).send("User logged out successfully.");
  } catch (e) {
    console.log(e);
    res.status(HTTP_BAD_REQUEST).send();
  }
};

module.exports = router;
