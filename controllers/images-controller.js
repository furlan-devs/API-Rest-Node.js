const mysql = require("../mysql");

exports.imageDelete = async (req, res, next) => {
    try {
      const query = ` DELETE FROM productimages WHERE imageId = ?`;
      await mysql.execute(query, [req.params.imageId]);
  
      const response = {
        message: "Image successfully removed",
        request: {
          type: "POST",
          description: "insert a product",
          url: process.env.URL_API + "products/" + req.body.productId + '/images',
          body: {
            productId: "Number",
            productImage: "File",
          },
        },
      };
  
      res.status(202).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  };