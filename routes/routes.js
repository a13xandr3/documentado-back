const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
router.get('/items', controller.getItems);                                      // retorna lista de documentos ok
router.get('/items/:id', controller.getItemById);                               // retorna id selecionado ok
router.get('/categoria', controller.dropdownPopulaCategoria);                   // Rota para buscar as categorias e popular no dropdown ok
router.get('/categoria/:palavrachave', controller.dropdownCategoriaSelected)    //busca pelo item selecionado no dropdown
router.post('/items', controller.createItem);                                   // rota para inclusão de item
router.put('/items/:id', controller.updateItem);                                // rota para alteraçaão de item
router.delete('/items/:id', controller.deleteItem);                             // rota para exclusão de item
module.exports = router;