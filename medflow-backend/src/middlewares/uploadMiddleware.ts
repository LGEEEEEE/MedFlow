import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Configura onde e como os PDFs dos laudos serão salvos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva na pasta 'uploads' na raiz do projeto
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Cria um hash aleatório para não ter conflito de nomes de exames iguais
    const hash = crypto.randomBytes(10).toString('hex');
    const nomeArquivo = `${hash}-${file.originalname}`;
    cb(null, nomeArquivo);
  }
});

export const uploadMiddleware = multer({ storage });