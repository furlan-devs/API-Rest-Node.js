const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productsRoute = require("./routes/products-route");
const ordersRoute = require("./routes/orders-route");
const usersRoute = require("./routes/users-route");
const imagesRoute = require("./routes/images-route");
const categoriesRoute = require("./routes/categories-route");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); //deixar a pasta uploads publica
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()); //json de entrada no body

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requerested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELET, GET");
    return res.status(200).send({});
  }
  next();
});

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/users", usersRoute);
app.use("/images", imagesRoute);
app.use("/categories", categoriesRoute);

// Quando não encontra a rota, entra aqui:
app.use((req, res, next) => {
  const erro = new Error("Not Found");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500);
  return res.send({
    erro: {
      message: error.message,
    },
  });
});

module.exports = app;
