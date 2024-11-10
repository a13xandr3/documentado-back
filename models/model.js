const { MongoClient, ObjectId, Binary } = require('mongodb');
const { Buffer } = require('buffer');
const { connectDB, tabela } = require('../config/database');

/*
async function findItems() {
    const db = await connectDB();
    let itens = [];
    let ext;
    const response = await db.collection(tabela).find().toArray();
    for ( let i = 0 ; i < response.length; i ++ ) {
        itens.push({
            _id: response[i]._id,
            titulo: response[i].titulo,
            descricao: response[i].descricao,
            categoria: response[i].categoria,
            tipo: response[i].tipo,
            detalhe: response[i].detalhe,
            valor: response[i].valor,
            extensao: response[i].extensao
        });
    }
    return itens;
}
*/

//Busca dados de um item específico
async function findItemById(id) {
    const db = await connectDB();
    const document = await db.collection(tabela).findOne({ _id: new ObjectId(id) });
    if (!document) {
        console.log("Documento não encontrado.");
        return null;
    }
    // Converter o campo binário `data` para uma string base64
    //const base64Data = document.arquivo.buffer.toString("base64");
    // Exibir ou retornar o documento completo, incluindo o campo convertido
    const result = {
        titulo: document.titulo, 
        descricao: document.descricao, 
        categoria: document.categoria, 
        tipo: document.tipo, 
        detalhe: document.detalhe, 
        valor: document.valor, 
        extensao: document.extensao, 
        arquivo: ''
    };
    return result;
}

async function base64(id) {
    const db = await connectDB();
    const document = await db.collection(tabela).findOne({ _id: new ObjectId(id) });
    if (!document.arquivo) {
        console.log("Documento ou campo binário não encontrado.");
        return null;
    }
    const base64Data = document.arquivo.buffer.toString("base64");
    const posicaoFinal = base64Data.indexOf('base64')+6;
    const data = base64Data.substring(0, posicaoFinal);
    const isPdf = data.indexOf('pdf') > 0 ? true : false;
    const _base64Data = base64Data.replace(data,'');
    let __base64Data;
    if ( isPdf ) {
        __base64Data = 'data:application/pdf;base64,' + _base64Data.substring(0, _base64Data.length);
    } else {
        __base64Data = _base64Data.substring(0, _base64Data.length-1);
    }
    const result = {
        arquivo: __base64Data
    };
    return result;
}

async function insertItem(item) {
    try {
        const db = await connectDB();
        const { titulo, descricao, categoria, tipo, detalhe, valor, extensao, arquivo } = item;
        const binaryFile = Binary.createFromBase64(arquivo);
        return db.collection(tabela).insertOne({
            titulo: titulo,
            descricao: descricao,
            categoria: categoria,
            tipo: tipo,
            detalhe: detalhe,
            valor: valor,
            extensao: extensao,
            arquivo: binaryFile
        });
    } catch (error) {
    }
}
async function updateItem(id, data) {
    try {
        const db = await connectDB();
        const { titulo, descricao, categoria, tipo, detalhe, valor, extensao, arquivo } = data;
        const binaryFile = Binary.createFromBase64(arquivo);
        const _data = { titulo: titulo, 
                        descricao: descricao, 
                        categoria: categoria, 
                        tipo: tipo, 
                        detalhe: detalhe, 
                        valor: valor, 
                        extensao: extensao, 
                        arquivo: binaryFile 
                    };
        return db.collection(tabela).updateOne(
            { _id: new ObjectId(id) },
            { $set: _data }
        )
    } catch (error) { }
}
async function deleteItem(id) {
    const db = await connectDB();
    return db.collection(tabela).deleteOne({ _id: new ObjectId(id) });
}
async function findItemsDropdownPopulaCategoria() {
    const db = await connectDB();
    return db.collection(tabela).distinct('categoria');
}
async function dropdownCategoriaSelected(palavraChave) {
    let itens = [];
    let ext;
    const db = await connectDB();
    const response = await db.collection(tabela).find({ categoria: new RegExp(palavraChave, 'i') }).toArray();
    for ( let i = 0 ; i < response.length ; i ++ ) {
        itens.push({
          _id: response[i]._id,
          titulo: response[i].titulo,
          descricao: response[i].descricao,
          categoria: response[i].categoria,
          tipo: response[i].tipo,
          detalhe: response[i].detalhe,
          valor: response[i].valor,
          extensao: response[i].extensao
        });
      }
    return itens;
}
async function searchDetalhe(palavraChave) {
    let itens = [];
    let ext;
    const db = await connectDB();
    const response = await db.collection(tabela).find({ detalhe: new RegExp(palavraChave, 'i') }).toArray();
    for ( let i = 0 ; i < response.length ; i ++ ) {
        itens.push({
          _id: response[i]._id,
          titulo: response[i].titulo,
          descricao: response[i].descricao,
          categoria: response[i].categoria,
          tipo: response[i].tipo,
          detalhe: response[i].detalhe,
          valor: response[i].valor,
          extensao: response[i].extensao
        });
      }
    return itens;
}
module.exports = { findItemById, base64, insertItem, updateItem, deleteItem, findItemsDropdownPopulaCategoria, dropdownCategoriaSelected, searchDetalhe };