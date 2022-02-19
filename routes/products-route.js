const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const ProductsController = require("../controllers/products-controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", ProductsController.productsGet);
router.post(
  "/",
  login.required,
  upload.single("productImage"),
  ProductsController.productPost
);
router.get("/:productId", ProductsController.productDetailGet);
router.patch("/:productId", login.required, ProductsController.productPatch);
router.delete("/:productId", login.required, ProductsController.productDelete);
router.post(
  "/:productId/image",
  login.required,
  upload.single("productImage"),
  ProductsController.imagePost
);

router.get("/:productId/images", ProductsController.imagesGet);

module.exports = router;
