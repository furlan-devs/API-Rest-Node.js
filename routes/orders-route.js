const express = require("express");
const router = express.Router();
const login = require("../middleware/login");


const OrdersController = require("../controllers/orders-controller");

router.get("/", OrdersController.ordersGet);
router.post("/",login.required, OrdersController.orderPost);
router.get("/:orderId", OrdersController.orderDetail);
router.delete("/",login.required, OrdersController.orderDelete);

module.exports = router;
