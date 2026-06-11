import { Router } from 'express';
import { ExameController } from '../controllers/exameController';
// 1. Importando o middleware de upload (Multer)
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const exameRoutes = Router();
const exameController = new ExameController();

exameRoutes.post('/:atendimentoId/solicitar', exameController.solicitar);

// 2. INJEÇÃO DO MIDDLEWARE DE UPLOAD
// Ele intercepta a requisição, salva o PDF na pasta uploads e depois passa pro controller
exameRoutes.put(
  '/:exameId/laudo', 
  uploadMiddleware.single('pdf'), // 'pdf' é o nome do campo que virá do front-end
  exameController.salvarLaudo
);

export { exameRoutes };