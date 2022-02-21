const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const CategoriesController = require("../controllers/categories-controller");


router.get("/", CategoriesController.categoriesGet);
router.post("/", login.required, CategoriesController.categoryPost);
router.patch(
  "/:categoryId",
  login.required,
  CategoriesController.categoryPatch
);
router.delete(
  "/:categoryId",
  login.required,
  CategoriesController.categoryDelete
);

module.exports = router;
