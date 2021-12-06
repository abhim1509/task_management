const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = "checkchecktoken";
const { getSpecificUser } = require("./../controllers/user");
const { updateRecord } = require("./../utils/database/database_wrapper");
const User = require("../utils/database/models/user");
modelUser = User;
const createToken = function (userId, email) {
  return jwt.sign({ userId, email }, tokenKey, { expiresIn: "2h" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, tokenKey);
    //console.log("decoded", decoded);
    //req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("User unauthorized.");
  }
};

const expireToken = function (userId, email) {
  jwt.sign({ userId, email }, tokenKey, { expiresIn: "1s" });
};

const logout = async (req, res) => {
  const body = req.body;
  console.log("body", body);
  //expireToken(body.user.id, body.user.email);
  const user = await db_wrapper.getRecord(modelUser, body.userId);
  console.log("user", user);
  user.token = "";
  const updatedUserObj = await updateRecord(
    modelUser,
    {
      email: user.email,
    },
    user
  );

  return expireToken(user._id, user.email)
    ? "User logged out successfully"
    : "An error while logging out user.";
};

module.exports.createToken = createToken;
module.exports.verifyToken = verifyToken;
module.exports.expireToken = expireToken;
module.exports.logout = logout;
