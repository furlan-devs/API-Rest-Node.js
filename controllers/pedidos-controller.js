const mysql = require("../mysql");

exports.getPedidos = async (req, res, next) => {
  try {
    const result = await mysql.execute(`SELECT pedidos.id_pedido,
    pedidos.quantidade,
    produtos.id_produto,
    produtos.nome,
    produtos.preco
FROM pedidos
INNER JOIN produtos
 ON produtos.id_produto = pedidos.id_produto;`);

    const response = {
      quantidade: result.length,
      pedidos: result.map((pedido) => {
        return {
          id_pedido: pedido.id_pedido,
          quantidade: pedido.quantidade,
          produto: {
            id_produto: pedido.id_produto,
            nome: pedido.nome,
            preco: pedido.preco,
          },

          request: {
            tipo: "GET",
            descricao: "Retorna os detalhes de um pedido específico",
            url: "http://localhost:3000/pedidos/" + pedido.id_produto,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postPedidos = async (req, res, next) => {
  try {
    const query1 = "SELECT * FROM produtos WHERE id_produto = ?";
    const result1 = await mysql.execute(query1, [req.body.id_produto]);

    if (result1.length == 0) {
      return res.status(404).send({
        menagem: "Produto não encontrado",
      });
    }

    const query = "INSERT INTO pedidos (id_produto, quantidade) VALUE (?, ?)";
    const result = await mysql.execute(query, [
      req.body.id_produto,
      req.body.quantidade,
    ]);

    const response = {
      mensagem: "Pedido inserido com sucesso",
      pedidoCriado: {
        id_pedido: result.id_pedido,
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
        request: {
          tipo: "GET",
          descricao: "Retorna todos os pedidos",
          url: "http://localhost:3000/pedidos",
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getUmPedido = async (req, res, next) => {
  try {
    const query = "SELECT * FROM pedidos WHERE id_pedido = ?";
    const result = await mysql.execute(query, [req.params.id_pedido]);

    if (result.length == 0) {
      return res.status(404).send({
        menagem: "Não foi encontrado pedido com este ID",
      });
    }

    const response = {
      pedido: {
        id_pedido: result[0].id_pedido,
        id_produto: result[0].id_produto,
        quantidade: result[0].quantidade,
        request: {
          tipo: "GET",
          descricao: "Retorna todos os pedidos",
          url: "http://localhost:3000/pedidos",
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deletePedido = async (req, res, next) => {
  try {
    const query = ` DELETE FROM pedidos WHERE id_pedido = ?`;
    await mysql.execute(query, [req.body.id_pedido]);

    const response = {
      mensagem: "Pedido removido com sucesso",
      request: {
        tipo: "POST",
        descricao: "Insere um pedido",
        url: "http//localhost:3000/pedidos",
        body: {
          id_produto: "Number",
          quantidade: "Number",
        },
      },
    };

    res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
