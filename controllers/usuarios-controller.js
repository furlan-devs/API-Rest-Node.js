const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postCadastro = async (req, res, next) => {

  try {
      // var query = `SELECT * FROM users WHERE email = ?`;
      // var result = await mysql.execute(query, [req.body.email]);

      // if (result.length > 0) {
      //     return res.status(409).send({ message: 'Usuário já cadastrado' })
      // }

      // const hash = await bcrypt.hashSync(req.body.password, 10);

      const usuarios = req.body.usuarios.map(usuario => [
        usuario.email,
          bcrypt.hashSync(user.password, 10)
      ])

      query = 'INSERT INTO usuarios (email, password) VALUES ?';
      const results = await mysql.execute(query, [ usuarios ]);

      const response = {
          message: 'Usuário criado com sucesso',
          createdUsers: req.body.usuarios.map(usuario => { return { email: usuario.email } })
      }
      return res.status(201).send(response);

  } catch (error) {
      return res.status(500).send({ error: error });
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    var results = await mysql.execute(query, [req.body.email]);

    if (results.length < 1) {
      return res.status(401).send({ message: "Falha na autenticação" });
    }

    if (await bcrypt.compareSync(req.body.senha, results[0].senha)) {
      const token = jwt.sign(
        {
          usuarioId: results[0].usuarioId,
          email: results[0].email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({
        message: "Autenticado com sucesso",
        token: token,
      });
    }
    return res.status(401).send({ message: "Falha na autenticação" });
  } catch (error) {
    return res.status(500).send({ message: "Falha na autenticação" });
  }
};
