const fs = require('fs');

function convertImageToBase64(filePath) {
  try {
    // Lê o arquivo da imagem de forma síncrona
    const imageBuffer = fs.readFileSync(filePath);
    // Converte o buffer da imagem para uma string base64
    const imageBase64 = imageBuffer.toString('base64');
    return imageBase64;
  } catch (error) {
    console.error('Erro ao converter a imagem para base64:', error);
    return null;
  }
}
module.exports = convertImageToBase64;