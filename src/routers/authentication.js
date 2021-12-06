const express = require("express");
const router = new express.Router();
const { verifyToken } = require("./../middlewares/auth");
const authController = require("./../controllers/authentication");

//const auth = require('./../middlewares/auth')

router.post("/register", authController.registerUser);
router.put("/login", authController.login);
router.put("/logout", verifyToken, authController.logout);

module.exports = router;
