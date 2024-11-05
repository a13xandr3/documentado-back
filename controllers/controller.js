const model = require('../models/model');
const { sendResponse, sendError } = require('../views/response');
async function getItems(req, res) {
  try {
    const items = await model.findItems();
    sendResponse(res, 200, items);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function getItemById(req, res) {
  try {
    const item = await model.findItemById(req.params.id);
    if (!item) return sendError(res, 404, 'Item não encontrado');
    sendResponse(res, 200, item);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function createItem(req, res) {
  try {
    const newItem = await model.insertItem(req.body);
    sendResponse(res, 201, newItem);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function updateItem(req, res) {
  try {
    const result = await model.updateItem(req.params.id, req.body);
    if (result.matchedCount === 0) return sendError(res, 404, 'Item não encontrado');
    sendResponse(res, 200, { message: 'Item atualizado com sucesso' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function deleteItem(req, res) {
  try {
    const result = await model.deleteItem(req.params.id);
    if (result.deletedCount === 0) return sendError(res, 404, 'Item não encontrado');
    sendResponse(res, 200, { message: 'Item excluído com sucesso' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function dropdownPopulaCategoria(req, res) {
  try {
    const items = await model.findItemsDropdownPopulaCategoria();
    sendResponse(res, 200, items);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function dropdownCategoriaSelected(req, res) {
  try {
    const item = await model.dropdownCategoriaSelected(req.params.palavrachave);
    sendResponse(res, 200, item);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
async function searchDetalhe(req, res) {
  try {
    const item = await model.searchDetalhe(req.params.palavrachave);
    sendResponse(res, 200, item);
  } catch (error) {
    sendError(res, 500, error.message);
  }
}
module.exports = { getItems, getItemById, createItem, updateItem, deleteItem, dropdownPopulaCategoria, dropdownCategoriaSelected, searchDetalhe };