const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

//router.get('/items', controller.getItems);                                    // Rota que retorna lista de documentos

router.get('/items/:id', controller.getItemById);                               // Rota que retorna id selecionado

router.get('/base64/:id', controller.base64);

router.get('/categoria', controller.dropdownPopulaCategoria);                   // Rota para buscar as categorias e popular no dropdown
router.get('/categoria/:palavrachave', controller.dropdownCategoriaSelected);   // Rota para buscar pelo item selecionado no dropdown
router.get('/detalhe/:palavrachave', controller.searchDetalhe);                 // Rota para buscar por uma palavra-chave

router.post('/items', controller.createItem);                                   // rota para inclusão de item
router.put('/items/:id', controller.updateItem);                                // rota para alteraçaão de item
router.delete('/items/:id', controller.deleteItem);                             // rota para exclusão de item

module.exports = router;