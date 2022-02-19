const express = require("express");
const { send } = require("express/lib/response");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require("../middleware/login");

const ImagesController = require('../controllers/images-controller')

router.delete("/:imageId", login.required, ImagesController.imageDelete);


module.exports = router;
