const mysql = require("../mysql");

exports.getProdutos = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM produtos");
    const response = {
      quantidade: result.length,
      produtos: result.map((prod) => {
        return {
          id_produto: prod.id_produto,
          nome: prod.nome,
          preco: prod.preco,
          imagem_produto: prod.imagem_produto,
          request: {
            tipo: "GET",
            descricao: "Retorna os detalhes de um produto específico",
            url: process.env.URL_API + "produtos/" + prod.id_produto,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduto = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO produtos (nome, preco, imagem_produto) VALUE (?, ?, ?)";
    const result = await mysql.execute(query, [
      req.body.nome,
      req.body.preco,
      req.file.path,
    ]);

    const response = {
      mensagem: "Produto inserido com sucesso",
      produtoCriado: {
        id_produto: result.id_produto,
        nome: req.body.nome,
        preco: req.body.preco,
        imagem_produto: req.file.path,
        request: {
          tipo: "GET",
          descricao: "Retorna todos os produtos",
          url: process.env.URL_API + "produtos",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getUmProduto = async (req, res, next) => {
  try {
    const query = "SELECT * FROM produtos WHERE id_produto = ?";
    const result = await mysql.execute(query, [req.params.id_produto]);

    if (result.length == 0) {
      return res.status(404).send({
        menagem: "Não foi encontrado produto com este ID",
      });
    }

    const response = {
      produto: {
        id_produto: result[0].id_produto,
        nome: result[0].nome,
        preco: result[0].preco,
        imagem_produto: result[0].imagem_produto,
        request: {
          tipo: "GET",
          descricao: "Retorna todos os produtos",
          url: process.env.URL_API + 'produtos',
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.alteraProduto = async (req, res, next) => {
  try {
    const query = `UPDATE produtos
  SET   nome       = ?,
        preco      = ?
  WHERE id_produto = ? `;

    await mysql.execute(query, [
      req.body.nome,
      req.body.preco,
      req.body.id_produto,
    ]);

    const response = {
      mensagem: "Produto atualizado com sucesso",
      produtoAtualizado: {
        id_produto: req.body.id_produto,
        nome: req.body.nome,
        preco: req.body.preco,
        request: {
          tipo: "GET",
          descricao: "Retorna os detalhes de um produto específico",
          url: process.env.URL_API + "produtos/" + req.body.id_produto,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProduto = async (req, res, next) => {
  try {
    const query = ` DELETE FROM produtos WHERE id_produto = ?`;
    await mysql.execute(query, [req.body.id_produto]);

    const response = {
      mensagem: "Produto removido com sucesso",
      request: {
        tipo: "POST",
        descricao: "Insere um produto",
        url: process.env.URL_API + "produtos",
        body: {
          nome: "String",
          preco: "Number",
        },
      },
    };

    res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postImagem = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO imagens_produtos (id_produto, caminho) VALUE (?, ?)";
    const result = await mysql.execute(query, [
      req.params.id_produto,
      req.file.path,
    ]);

    console.log(result);
    const response = {
      mensagem: "Imagem inserida com sucesso",
      imagemCriada: {
        id_produto: parseInt(req.params.id_produto),
        id_imagem: result.insertId,
        imagem_produto: req.file.path,
        request: {
          tipo: "GET",
          descricao: "Retorna todas as imagens",
          url: process.env.URL_API + "produtos/" + req.params.id_produto + "/imagens",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};

exports.getImagens = async (req, res, next) => {
  try {
    const query = "SELECT * FROM imagens_produtos WHERE id_produto = ?";
    const result = await mysql.execute(query, [req.params.id_produto]);
    const response = {
      quantidade: result.length,
      imagens: result.map((img) => {
        return {
          id_produto: parseInt(req.params.id_produto),
          id_imagem: img.id_imagem,
          caminho: process.env.URL_API + img.caminho,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
