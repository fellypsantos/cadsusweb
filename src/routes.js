const express = require("express");
const routes = express.Router();
const UserController = require("../src/controller/UserController");

routes.get("/", (req, res) => {
  res.render("index");
});

routes.get("/cartao/:cns", UserController.generateCard);
routes.get("/existe_usuario/:cns", UserController.userExists);

routes.post("/novo_usuario", UserController.addUser);

module.exports = routes;
