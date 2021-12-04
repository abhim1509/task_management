const express = require("express");
const router = new express.Router();
const userController = require("./../controllers/user");
//const auth = require('./../middlewares/auth')

router.post("/users", userController.createUser);
//router.post('/users/login', userController.userLogin)
router.get("/users/:userId", userController.getSpecificUser);

module.exports = router;
