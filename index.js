const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const convertImageToBase64 = require('./convertToBase64');
const saveBase64AsImage = require('./convertBase64toImage');
const cors = require('cors');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
//app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb://localhost:27017"; // URL do MongoDB

const client = new MongoClient(uri);

let db;

client.connect()
   .then(() => {
      db = client.db('crud'); // Nome do banco de dados
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

   // Rota para criar um novo item
   app.post('/items', async (req, res) => {
    try {
      const resultado = await db.collection('Item').insertOne(rq(req));
      console.log(resultado);
      res.status(201).json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
   })

  // READ - Obter todos os documentos
  app.get('/items', async (req, res) => {
    try {
      const itens = await db.collection('Item').find().toArray();
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

  // Exemplo de uso:
  // const base64String = convertImageToBase64('caminho/para/sua/imagem.jpg');
  // console.log(base64String);

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

  // Exemplo de uso:
// const base64String = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'; // Sua string base64 aqui
// saveBase64AsImage(base64String, './imagens');


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
