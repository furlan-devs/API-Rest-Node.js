const express = require("express");
const { send } = require("express/lib/response");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require("../middleware/login");

const ImagensController = require('../controllers/imagens-controller')

router.delete("/:id_imagem", login.obrigatorio, ImagensController.deleteImagem);


module.exports = router;
