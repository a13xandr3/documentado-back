const fs = require('fs');
const path = require('path');

function saveBase64AsImage(base64String, directory = './') {
    // Gerar o nome do arquivo com base na data e hora atuais
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const fileName = `esteves-${dd}${mm}${yyyy}-${hh}${min}${ss}.jpg`;
  
    // Verificar se o diretório existe; se não, criar
    if (!fs.existsSync(directory)){
      fs.mkdirSync(directory, { recursive: true });
    }
  
    // Extrair apenas a parte da imagem da string base64 (remover o prefixo do data URL)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
    // Converter a string base64 para um buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
  
    // Determinar o caminho completo do arquivo
    const filePath = path.join(directory, fileName);
  
    // Escrever o buffer no arquivo
    fs.writeFileSync(filePath, imageBuffer);
  
    console.log(`Imagem salva com sucesso: ${filePath}`);
    return filePath; // Retorna o caminho do arquivo para referência
  }

  module.exports = saveBase64AsImage;