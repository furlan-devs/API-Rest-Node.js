const mysql = require("../mysql");

exports.ordersGet = async (req, res, next) => {
  try {
    const result = await mysql.execute(`SELECT orders.orderId,
    orders.quantity,
    products.productId,
    products.name,
    products.price
FROM orders
INNER JOIN products
 ON products.productId = orders.productId;`);

    const response = {
      length: result.length,
      orders: result.map((order) => {
        return {
          orderId: order.orderId,
          length: order.quantity,
          produto: {
            productId: order.productId,
            name: order.name,
            price: order.price,
          },

          request: {
            type: "GET",
            description: "Returns the details of a specific order",
            url: "http://localhost:3000/orders/" + order.productId,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.orderPost = async (req, res, next) => {
  try {
    const productQuery = "SELECT * FROM products WHERE productId = ?";
    const productResult = await mysql.execute(productQuery, [req.body.productId]);

    if (productResult.length == 0) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    const ordersQuery = "INSERT INTO orders (productId, quantity) VALUE (?, ?)";
    const ordersResult = await mysql.execute(ordersQuery, [
      req.body.productId,
      req.body.quantity,
    ]);

    const response = {
      message: "Order entered successfully",
      createdOrder: {
        orderId: ordersResult.orderId,
        productId: req.body.productId,
        length: req.body.quantity,
        request: {
          type: "GET",
          description: "Returns all orders",
          url: "http://localhost:3000/orders",
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.orderDetail = async (req, res, next) => {
  try {
    const query = "SELECT * FROM orders WHERE orderId = ?";
    const result = await mysql.execute(query, [req.params.orderId]);

    if (result.length == 0) {
      return res.status(404).send({
        message: "No order found with this ID",
      });
    }

    const response = {
      order: {
        orderId: result[0].orderId,
        productId: result[0].productId,
        length: result[0].quantity,
        request: {
          type: "GET",
          description: "Returns all orders",
          url: "http://localhost:3000/orders",
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.orderDelete = async (req, res, next) => {
  try {
    const query = ` DELETE FROM orders WHERE orderId = ?`;
    await mysql.execute(query, [req.body.orderId]);

    const response = {
      message: "Order removed successfully",
      request: {
        type: "POST",
        description: "Insert an order",
        url: "http//localhost:3000/orders",
        body: {
          productId: "Number",
          length: "Number",
        },
      },
    };

    res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
