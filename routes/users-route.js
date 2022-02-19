const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users-controller");

router.post("/", UsersController.signupPost);
router.post("/login", UsersController.loginPost);

module.exports = router;
