const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = "checkchecktoken";

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
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

const expireToken = function (userId, email) {
  console.log(jwt.sign({ userId, email }, tokenKey, { expiresIn: "1s" }));
};

module.exports.createToken = createToken;
module.exports.verifyToken = verifyToken;
module.exports.expireToken = expireToken;
