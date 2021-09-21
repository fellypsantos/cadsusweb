const express = require('express')
const routes = express.Router()
const UserController = require('../src/controller/UserController')

routes.get('/', (req, res) => {
  res.render('index')
})

routes.get('/cartao/:cns', UserController.generateCard)
routes.get('/cartao_extract/', (req, res) => res.render('extractor'))
routes.get('/cartao_api/:jsondata', UserController.generateCardPastingData)
routes.get('/existe_usuario/:cns', UserController.userExists)
routes.post('/novo_usuario', UserController.addUser)
// routes.put("/atualiza_usuario/:id", UserController.updateUser);
routes.delete('/remove_usuario/:id', UserController.removeUser)

module.exports = routes
