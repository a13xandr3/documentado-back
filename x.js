app.get('/search/:palavrachave', async (req, res) => {
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