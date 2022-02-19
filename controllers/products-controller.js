const mysql = require("../mysql");

exports.productsGet = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products";
    const result = await mysql.execute(query);
    const response = {
      length: result.length,
      products: result.map((prod) => {
        return {
          productId: prod.productId,
          name: prod.name,
          price: prod.price,
          productImage: prod.productImage,
          request: {
            type: "GET",
            description: "Returns the details of a specific product",
            url: process.env.URL_API + "products/" + prod.productId,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.productPost = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO products (name, price, productImage, categoryId) VALUES (?, ?, ?, ?)";
    const result = await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.file.path,
      req.body.categoryId
    ]);

    const response = {
      message: "Product inserted successfully",
      createdProduct: {
        productId: result.insertId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        categoryId: req.body.categoryId,
        request: {
          type: "GET",
          description: "Returns all products",
          url: process.env.URL_API + "products",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};

exports.productDetailGet = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products WHERE productId = ?";
    const result = await mysql.execute(query, [req.params.productId]);

    if (result.length == 0) {
      return res.status(404).send({
        message: "No products found with this ID",
      });
    }

    const response = {
      produto: {
        productId: result[0].productId,
        name: result[0].name,
        price: result[0].price,
        productImage: result[0].productImage,
        request: {
          type: "GET",
          description: "Returns all products",
          url: process.env.URL_API + "products",
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.productPatch = async (req, res, next) => {
  try {
    const query = `UPDATE products
  SET   name       = ?,
        price      = ?
  WHERE productId = ? `;

    await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.params.productId,
    ]);

    const response = {
      message: "Product successfully updated",
      produtoAtualizado: {
        productId: req.params.productId,
        name: req.body.name,
        price: req.body.price,
        request: {
          type: "GET",
          description: "Returns the details of a specific product",
          url: process.env.URL_API + "products/" + req.params.productId,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.productDelete = async (req, res, next) => {
  try {
    const query = ` DELETE FROM products WHERE productId = ?`;
    await mysql.execute(query, [req.params.productId]);

    const response = {
      message: "Product removed successfully",
      request: {
        type: "POST",
        description: "Insert a product",
        url: process.env.URL_API + "products",
        body: {
          name: "String",
          price: "Number",
        },
      },
    };

    res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.imagePost = async (req, res, next) => {
  try {
    const query = "INSERT INTO productImages (productId, path) VALUES (?,?)";
    const result = await mysql.execute(query, [
      req.params.productId,
      req.file.path,
    ]);
    const response = {
      message: "Image successfully inserted",
      createdImage: {
        productId: parseInt(req.params.productId),
        imageId: result.insertId,
        path: req.file.path,
        request: {
          type: "GET",
          description: "Returns all images",
          url:
            process.env.URL_API +
            "products/" +
            req.params.productId +
            "/images",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.imagesGet = async (req, res, next) => {
  try {
    const query = "SELECT * FROM productimages WHERE productId = ?";
    const result = await mysql.execute(query, [req.params.productId]);
    const response = {
      quantity: result.length,
      images: result.map((img) => {
        return {
          productId: parseInt(req.params.productId),
          imageId: img.imageId,
          path: process.env.URL_API + img.path,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
