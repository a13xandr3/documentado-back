const { MongoClient } = require('mongodb');
const { Environment } = require('../environment');
let uri = Environment[0].uri;
let database = Environment[0].database;
let db;
let tabela = Environment[0].table;
const client = new MongoClient(uri);

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(database);
    console.log("Conectado ao MongoDB!");
  }
  return db;
}

module.exports = { connectDB, tabela };