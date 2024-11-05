const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
async function findItems() {
  const db = await connectDB();
  let itens = [];
  let ext;
  const response = await db.collection('Item').find().toArray();
  for ( let i = 0 ; i < response.length ; i ++ ) {
    ext = response[i]?.arquivo?.split(';base64,')[0]?.split(':')[1]?.split('/')[1];
    itens.push({
      _id: response[i]._id,
      titulo: response[i].titulo,
      descricao: response[i].descricao,
      categoria: response[i].categoria,
      tipo: response[i].tipo,
      detalhe: response[i].detalhe,
      valor: response[i].valor,
      extensao: ext
    });
  }
  return itens;
}
async function findItemById(id) {
  const db = await connectDB();
  return db.collection('Item').findOne({ _id: new ObjectId(id) });
}
async function insertItem(data) {
  const db = await connectDB();
  return db.collection('Item').insertOne(data);
}
async function updateItem(id, data) {
  const db = await connectDB();
  return db.collection('Item').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
}
async function deleteItem(id) {
  const db = await connectDB();
  return db.collection('Item').deleteOne({ _id: new ObjectId(id) });
}
async function findItemsDropdownPopulaCategoria() {
    const db = await connectDB();
    return db.collection('Item').distinct('categoria');
}
async function dropdownCategoriaSelected(palavraChave) {
    let itens = [];
    let ext;
    const db = await connectDB();
    const response = await db.collection('Item').find({ categoria: new RegExp(palavraChave, 'i') }).toArray();
    for ( let i = 0 ; i < response.length ; i ++ ) {
        ext = response[i]?.arquivo?.split(';base64,')[0]?.split(':')[1]?.split('/')[1];
        itens.push({
          _id: response[i]._id,
          titulo: response[i].titulo,
          descricao: response[i].descricao,
          categoria: response[i].categoria,
          tipo: response[i].tipo,
          detalhe: response[i].detalhe,
          valor: response[i].valor,
          extensao: ext
        });
      }
    return itens;
}

module.exports = { findItems, findItemById, insertItem, updateItem, deleteItem, findItemsDropdownPopulaCategoria, dropdownCategoriaSelected };