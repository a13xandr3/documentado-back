const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const convertImageToBase64 = require('./convertToBase64');
const saveBase64AsImage = require('./convertBase64toImage');

const cors = require('cors');
const app = express();
var buffer = require('buffer/').Buffer;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let db;

client.connect()
   .then(() => {
      db = client.db('crud');
      console.log("Conectado ao MongoDB!");
   })
   .catch(err => console.error(err));

   function rq(req) {
     return {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      tipo: req.body.tipo,
      detalhe: req.body.detalhe,
      arquivo: req.body.arquivo,
      valor: req.body.valor
    }
   }

  app.get('/detalhe/:palavrachave', async (req, res) => {
    try {
      const palavraChave = req.params.palavrachave;
      const resultado = await db.collection('Item').find({ detalhe: new RegExp(palavraChave, 'i') }).toArray();
      if (resultado.length === 0) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.status(200).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });


  //* quando selecionado a categoria via dropdown
  app.get('/categoria/:palavrachave', async (req, res) => {
    try {
      let itens = [];
      let ext;
      const palavraChave = req.params.palavrachave;
      const response = await db.collection('Item').find({ categoria: new RegExp(palavraChave, 'i') }).toArray();
      if (response.length === 0) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
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
      res.status(200).json(itens);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // rota para exibir as categorias para popular o dropdown
  app.get('/categoria', async (req, res) => {
    try {
      const categorias = await db.collection('Item').distinct('categoria');
      if (categorias.length === 0) {
        return res.status(404).json({ error: 'Nenhuma categoria encontrada' });
      }
      res.status(200).json(categorias);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // rota para exibir apenas o item selecionado no dropdown categoria
  app.get('/dropdowncategoria/:palavrachave', async (req, res) => {
    try {
      const palavraChave = req.params.palavrachave;
      let itens = [];
      let ext;
      const response = await db.collection('Item').find({ categoria: new RegExp(palavraChave, 'i') }).toArray();
      if (response.length === 0) {
        return res.status(404).json({ error: 'Nenhuma categoria encontrada' });
      }
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
      console.log(itens);
      res.status(200).json(itens);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

   // Rota para criar um novo item
   app.post('/items', async (req, res) => {
    try {
      const resultado = await db.collection('Item').insertOne(rq(req));
      //console.log(resultado);
      res.status(201).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
   })

  // READ - Obter base64 por meio do ID
  app.get('/base64/:id', async (req,res) => {
    try {
      const itens = await db.collection('Item').findOne({ _id: new ObjectId(req.params.id) });
      if (!itens) {
          return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.status(200).json(itens.arquivo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // READ - Obter todos os documentos
  app.get('/items', async (req, res) => {
     try {
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
      //console.log(itens);
      res.status(200).json(itens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/items/:id', async (req, res) => {
    try {
      const itens = await db.collection('Item').findOne({ _id: new ObjectId(req.params.id) });
      if (!itens) {
          return res.status(404).json({ error: 'Item não encontrado' });
      }
      console.log(itens);
      res.status(200).json(itens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // UPDATE - Atualizar um documento pelo ID
  app.put('/items/:id', async (req, res) => {
    try {
      const resultado = await db.collection('Item').updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: rq(req) }
      );
      if (resultado.matchedCount === 0) {
          return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.status(200).json({ message: 'Item atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // DELETE - Excluir um documento pelo ID
  app.delete('/items/:id', async (req, res) => {
    try {
      const resultado = await db.collection('Item').deleteOne({ _id: new ObjectId(req.params.id) });
      if (resultado.deletedCount === 0) {
          return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.status(200).json({ message: 'Item excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/convertBase64/:id', async (req,res) => {
    const base64String = convertImageToBase64(req.params.id);
    return res.json({ message: base64String });
  })
  app.get('/convertBase64ToImage/:id', async (req,res) => {
    try {
      console.log(req.params.id);
      const _base64String = `data:image/jpeg;base64,/9j/${req.params.id}`;
      const base64String = `data:image/png;base64,/9j/${req.params.id}`;
      console.log(base64String);
      saveBase64AsImage(base64String, '/Users/alexandreesteves/Downloads/imagens');
      return res.json({ message: 'processado com sucesso' });
    } catch (err) {
      console.log(err);
    }
  });



  // Função para comprimir a string Base64
  async function compressBase64(base64Str) {
    // Converte a string Base64 para um buffer binário
    const buffer = Buffer.from(base64Str, 'base64');
    
    // Compacta o buffer usando gzip
    return new Promise((resolve, reject) => {
      zlib.gzip(buffer, (error, compressedBuffer) => {
        if (error) {
          return reject(error);
        }
        // Converte o buffer compactado de volta para Base64
        resolve(compressedBuffer.toString('base64'));
      });
    });
  }



app.listen(3000, () => {
    console.log('ServidoCryptoJS.r rodando na porta 3000');
});
