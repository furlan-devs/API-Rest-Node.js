const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signupPost = async (req, res, next) => {
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const result = await mysql.execute(query, [req.body.email]);

    if (result.length > 0) {
      return res.status(409).send({ message: "User already registered" });
    }
    console.log(req.body.password)

    const hash = bcrypt.hashSync(req.body.password, 10);
    // const usuarios = req.body.usuarios.map((usuario) => [
    //   usuario.email,
    //   bcrypt.hashSync(user.password, 10),
    // ]);
    console.log(hash)

    const results = await mysql.execute("INSERT INTO users (email, password) VALUES (?, ?)", [req.body.email, hash]);
    const response = {
      message: "Usuário criado com sucesso",
      createdUsers: { 
      userId: result.insertId,
      email: req.body.email
      }
    };
    return res.status(201).send(response);
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error });
  }
};

exports.loginPost = async (req, res, next) => {
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const results = await mysql.execute(query, [req.body.email]);

    if (results.length < 1) {
      return res.status(401).send({ message: "Authentication failed" });
    }
    if (bcrypt.compareSync(req.body.password, results[0].password)) {
      
      const token = jwt.sign({
          userId: results[0].userId,
          email: results[0].email
      },
      process.env.JWT_KEY,
      {
          expiresIn: "1h"
      });
      return res.status(200).send({
          message: 'Successfully authenticated',
          token: token
      });
  }
    return res.status(401).send({ message: "Falha na autenticação" });
  } catch (error) {
    
    return res.status(500).send({ message: "Falha na autenticação" });
  }
};
