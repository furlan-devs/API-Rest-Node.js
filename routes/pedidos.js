const express = require("express");
const router = express.Router();
const login = require("../middleware/login");


const PedidosController = require("../controllers/pedidos-controller");

router.get("/", PedidosController.getPedidos);
router.post("/",login.obrigatorio, PedidosController.postPedidos);
router.get("/:id_pedido", PedidosController.getUmPedido);
router.delete("/",login.obrigatorio, PedidosController.deletePedido);

module.exports = router;
